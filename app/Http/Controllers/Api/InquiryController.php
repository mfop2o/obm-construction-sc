<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * InquiryController — public "Request a Quote" submissions + admin triage.
 *
 * Public endpoints are unauthenticated; every submission is validated and
 * stored, and an optional attachment (pdf/doc/docx or image, ≤10 MB) is kept
 * on the public disk so the admin can download it. The consent checkbox is
 * required (GDPR-style), and only the visitor's own submission id is returned.
 *
 * Admin endpoints are protected by the `auth` middleware (Sanctum session)
 * and manage the triage workflow: status, internal note, follow-up date,
 * read/unread, attachment view/download, and deletion.
 */
class InquiryController extends Controller
{
    /** Public: submit a project inquiry / request a quote. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'project_type' => ['nullable', 'string', 'max:255'],
            'project_location' => ['nullable', 'string', 'max:255'],
            'budget_range' => ['nullable', 'string', 'max:50'],
            'start_timeline' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:10000'],
            'preferred_contact' => ['nullable', 'string', 'in:email,phone'],
            'consent' => ['required', 'accepted'],
            'attachment' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png'],
        ]);

        $inquiry = Inquiry::create($data);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('inquiries', 'public');
            $inquiry->update([
                'attachment_path' => $path,
                'attachment_name' => $file->getClientOriginalName(),
                'attachment_size' => $file->getSize(),
                'attachment_mime' => $file->getMimeType(),
            ]);
        }

        return response()->json([
            'data' => $inquiry->only(['id', 'name', 'email', 'created_at']),
        ], 201);
    }

    /** Admin: list inquiries with optional status / unread filters, newest first. */
    public function index(Request $request): JsonResponse
    {
        $inquiries = Inquiry::query()
            ->when($request->string('status')->value(), fn ($q, $status) => $q->where('status', $status))
            ->when($request->boolean('unread'), fn ($q) => $q->where('read', false))
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $inquiries]);
    }

    /** Admin: single inquiry, full detail (includes internal note / attachment urls). */
    public function show(int $id): JsonResponse
    {
        $inquiry = Inquiry::findOrFail($id)->append('attachment_url');

        return response()->json(['data' => $inquiry]);
    }

    /** Admin: update status. */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:'.implode(',', Inquiry::STATUSES)],
        ]);

        $inquiry = Inquiry::findOrFail($id);
        $inquiry->update($data);

        return response()->json(['data' => $inquiry]);
    }

    /** Admin: update the read/unread flag. */
    public function updateRead(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'read' => ['required', 'boolean'],
        ]);

        $inquiry = Inquiry::findOrFail($id);
        $inquiry->update($data);

        return response()->json(['data' => $inquiry]);
    }

    /** Admin: update internal note + follow-up date (never exposed publicly). */
    public function updateNote(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'internal_note' => ['nullable', 'string', 'max:2000'],
            'follow_up_at' => ['nullable', 'date'],
        ]);

        $inquiry = Inquiry::findOrFail($id);
        $inquiry->update($data);

        return response()->json(['data' => $inquiry]);
    }

    /** Admin: download / view the visitor's attachment. */
    public function attachment(int $id): BinaryFileResponse|JsonResponse
    {
        $inquiry = Inquiry::findOrFail($id);

        if (! $inquiry->attachment_path || ! Storage::disk('public')->exists($inquiry->attachment_path)) {
            return response()->json(['message' => 'Attachment not found.'], 404);
        }

        return response()->download(
            Storage::disk('public')->path($inquiry->attachment_path),
            $inquiry->attachment_name ?? 'attachment',
            ['Content-Type' => $inquiry->attachment_mime],
        );
    }

    /** Admin: delete an inquiry (and its attachment). */
    public function destroy(int $id): JsonResponse
    {
        $inquiry = Inquiry::findOrFail($id);

        if ($inquiry->attachment_path) {
            Storage::disk('public')->delete($inquiry->attachment_path);
        }
        $inquiry->delete();

        return response()->json(null, 204);
    }
}
