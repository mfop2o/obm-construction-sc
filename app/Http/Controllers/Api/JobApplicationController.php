<?php

namespace App\Http\Controllers\Api;

use App\Enums\JobApplicationStatus;
use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\Opening;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * JobApplicationController — the online recruitment workflow.
 *
 * Public
 * - store():  a candidate submits an application; the system generates the
 *             reference (OBM-2026-00125) and stores the CV and certificates.
 *
 * Admin (Sanctum session)
 * - index()/show()/updateStatus()/updateNote()/attachment()/destroy():
 *             the HR dashboard — triage an applicant, read their CV, download
 *             certificates and record internal notes.
 */
class JobApplicationController extends Controller
{
    /** Public: submit a job application. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'opening_id' => ['nullable', 'integer', 'exists:openings,id'],
            'position_applied_for' => ['required', 'string', 'max:255'],
            'full_name' => ['required', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'education' => ['nullable', 'string', 'max:2000'],
            'work_experience' => ['nullable', 'string', 'max:2000'],
            'skills' => ['nullable', 'string', 'max:1000'],
            'years_of_experience' => ['nullable', 'integer', 'min:0', 'max:70'],
            'cover_letter' => ['nullable', 'string', 'max:5000'],
            'consent' => ['required', 'accepted'],
            'cv' => ['required', 'file', 'max:8192', 'mimes:pdf,doc,docx'],
            'certificates' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png'],
        ]);

        $opening = isset($data['opening_id'])
            ? Opening::findOrFail($data['opening_id'])
            : null;

        // Applications close with the vacancy's advertised deadline.
        if ($opening !== null && $opening->isClosed()) {
            return response()->json([
                'message' => 'This vacancy is no longer accepting applications.',
                'errors' => ['opening_id' => ['This vacancy is closed.']],
            ], 422);
        }

        $cv = $request->file('cv');
        $certificates = $request->file('certificates');

        // persistWithNumber() generates the OBM-YYYY-##### reference inside a
        // transaction so a duplicate never leaves a half-written row behind.
        $application = JobApplication::persistWithNumber([
            ...$this->applicantFields($data),
            'opening_id' => $opening?->id,
            'position_applied_for' => $data['position_applied_for'],
            'cv_path' => $cv->store('job-applications/cv', 'public'),
            'cv_name' => $cv->getClientOriginalName(),
            'cv_mime' => $cv->getMimeType(),
            'cv_size' => $cv->getSize(),
            'certificates_path' => $certificates?->store('job-applications/certificates', 'public'),
            'certificates_name' => $certificates?->getClientOriginalName(),
            'certificates_mime' => $certificates?->getMimeType(),
            'certificates_size' => $certificates?->getSize(),
            'status' => JobApplicationStatus::New,
            'applied_at' => now(),
        ]);

        return response()->json([
            'data' => [
                'application_number' => $application->application_number,
                'position_applied_for' => $application->position_applied_for,
                'applied_at' => $application->applied_at,
            ],
        ], 201);
    }

    /** Admin: list applications with search and status filters, newest first. */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['nullable', Rule::enum(JobApplicationStatus::class)],
            'search' => ['nullable', 'string', 'max:255'],
            'opening_id' => ['nullable', 'integer', 'exists:openings,id'],
        ]);

        $applications = JobApplication::query()
            ->with('opening:id,title')
            ->ofStatus($request->string('status')->value() ?: null)
            ->when($request->filled('opening_id'), fn ($q) => $q->where('opening_id', $request->integer('opening_id')))
            ->search($request->string('search')->value())
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $applications]);
    }

    /** Admin: recruitment dashboard counters. */
    public function summary(): JsonResponse
    {
        $counts = JobApplication::query()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        return response()->json([
            'data' => [
                'total' => (int) $counts->sum(),
                'by_status' => collect(JobApplicationStatus::cases())
                    ->mapWithKeys(fn (JobApplicationStatus $status) => [
                        $status->value => (int) $counts->get($status->value, 0),
                    ])
                    ->all(),
            ],
        ]);
    }

    /** Admin: a single application in full. */
    public function show(int $id): JsonResponse
    {
        $application = JobApplication::query()
            ->with('opening')
            ->findOrFail($id);

        return response()->json([
            'data' => $application->append(['cv_url', 'certificates_url']),
        ]);
    }

    /** Admin: move an application through the triage workflow. */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::enum(JobApplicationStatus::class)],
        ]);

        $application = JobApplication::findOrFail($id);
        $application->update($data);

        return response()->json(['data' => $application->fresh()]);
    }

    /** Admin: record an internal note (never exposed publicly). */
    public function updateNote(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'admin_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $application = JobApplication::findOrFail($id);
        $application->update($data);

        return response()->json(['data' => $application->fresh()]);
    }

    /** Admin: download an applicant's CV or certificates. */
    public function attachment(Request $request, int $id): BinaryFileResponse|JsonResponse
    {
        $kind = $request->string('kind')->value() ?: 'cv';

        if (! in_array($kind, ['cv', 'certificates'], true)) {
            return response()->json(['message' => 'Unknown attachment type.'], 422);
        }

        $application = JobApplication::findOrFail($id);
        $path = $application->{$kind.'_path'};

        if (! $path || ! Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'Attachment not found.'], 404);
        }

        return response()->download(
            Storage::disk('public')->path($path),
            $application->{$kind.'_name'} ?? $kind,
            ['Content-Type' => $application->{$kind.'_mime'} ?? 'application/octet-stream'],
        );
    }

    /** Admin: delete an application and its attachments. */
    public function destroy(int $id): JsonResponse
    {
        $application = JobApplication::findOrFail($id);
        $application->deleteAttachments();
        $application->delete();

        return response()->json(null, 204);
    }

    /**
     * Keep only the applicant-supplied, non-file fields.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function applicantFields(array $data): array
    {
        return array_intersect_key($data, array_flip([
            'full_name',
            'gender',
            'date_of_birth',
            'phone',
            'email',
            'address',
            'education',
            'work_experience',
            'skills',
            'years_of_experience',
            'cover_letter',
        ]));
    }
}
