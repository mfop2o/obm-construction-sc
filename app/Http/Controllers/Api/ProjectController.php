<?php

namespace App\Http\Controllers\Api;

use App\Enums\ProjectStatus;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectDocument;
use App\Models\ProjectHistory;
use App\Models\ProjectPhoto;
use Database\Seeders\ProjectSeeder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * ProjectController — public project portfolio plus the administrator content
 * system for the project portal described in the TOR.
 *
 * Public endpoints
 * - index():  list projects, with search, filtering and automatic categorisation
 * - show():   a single project with its photos, history timeline and documents
 * - documentDownload(): public download of a project document
 *
 * Admin endpoints (Sanctum session) maintain everything else: project facts and
 * status, uploaded photography (upload / delete / reorder / cover), the history
 * timeline and downloadable documents.
 */
class ProjectController extends Controller
{
    /**
     * The automatic categories a visitor may browse. Each one is derived from
     * the project's status or recency, so nothing has to be moved by hand.
     */
    private const GROUPS = ['latest', 'previous', 'ongoing', 'completed', 'accepted', 'upcoming'];

    /** Public: list projects (search, filters, categories). */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'group' => ['nullable', Rule::in(self::GROUPS)],
            'status' => ['nullable', Rule::enum(ProjectStatus::class)],
            'region' => ['nullable', 'string', 'max:255'],
            'year' => ['nullable', 'string', 'max:20'],
            'category' => ['nullable', 'string', 'max:255'],
        ]);

        $projects = $this->portfolio($request);

        return response()->json(['data' => $projects]);
    }

    /**
     * Build the public project query from the request's search and filters.
     *
     * Every relation the detail page renders is eager loaded here, so a single
     * request hydrates the listing and the detail view without a second call.
     */
    private function portfolio(Request $request): Collection
    {
        $query = Project::query()->with(['photos', 'histories', 'documents']);

        $this->applyGroup($query, $request->string('group')->value());
        $this->applyFilters($query, $request);
        $this->applySearch($query, $request->string('search')->value());

        return $query->get();
    }

    /**
     * Apply an automatic category. Categories are derived, never stored.
     */
    private function applyGroup(Builder $query, ?string $group): void
    {
        match ($group) {
            'latest' => $query->latest(),
            'previous' => $query->previous(),
            'ongoing' => $query->ongoing(),
            'completed' => $query->completed(),
            'accepted' => $query->accepted(),
            'upcoming' => $query->upcoming(),
            default => $query,
        };
    }

    /**
     * Apply status, region, year and category filters.
     */
    private function applyFilters(Builder $query, Request $request): void
    {
        $query
            ->when($request->filled('status'), fn (Builder $q) => $q->where('status', $request->string('status')->value()))
            ->when($request->filled('region'), fn (Builder $q) => $q->where('region', $request->string('region')->value()))
            ->when($request->filled('category'), fn (Builder $q) => $q->where('category', $request->string('category')->value()))
            ->when($request->filled('year'), fn (Builder $q) => $q->where('year', $request->string('year')->value()));
    }

    /**
     * Free-text search across the facts a visitor would search for: name,
     * location, region, type, client and status.
     */
    private function applySearch(Builder $query, ?string $term): void
    {
        $term = trim((string) $term);

        if ($term === '') {
            return;
        }

        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';

        $query->where(function (Builder $inner) use ($like) {
            $inner->where('title', 'like', $like)
                ->orWhere('location', 'like', $like)
                ->orWhere('region', 'like', $like)
                ->orWhere('category', 'like', $like)
                ->orWhere('client', 'like', $like)
                ->orWhere('consultant', 'like', $like)
                ->orWhere('status', 'like', $like)
                ->orWhere('year', 'like', $like);
        });
    }

    /** Public: show a single project with its portal relations. */
    public function show(string $slug): JsonResponse
    {
        $project = Project::query()
            ->where('slug', $slug)
            ->with(['photos', 'histories', 'documents'])
            ->firstOrFail();

        return response()->json([
            'data' => $project->append(['display_image', 'cover_photo_url']),
        ]);
    }

    /** Public: download a project document. */
    public function documentDownload(int $projectId, int $documentId): BinaryFileResponse|JsonResponse
    {
        $document = ProjectDocument::query()
            ->where('project_id', $projectId)
            ->findOrFail($documentId);

        if (! $document->fileExists()) {
            return response()->json(['message' => 'Document not found.'], 404);
        }

        return response()->download(
            Storage::disk('public')->path($document->path),
            $document->original_name ?? $document->title,
            ['Content-Type' => $document->mime ?? 'application/octet-stream'],
        );
    }

    /* ---- Admin: project records ---- */

    /** Admin: create a new project. */
    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $min = Project::min('sort_order');
        $data['sort_order'] = ($min ?? 0) - 1;
        $project = Project::create($data);

        return response()->json(['data' => $project], 201);
    }

    /** Admin: update an existing project. */
    public function update(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        $data = $this->validated($request, $project, partial: true);
        $project->update($data);

        return response()->json([
            'data' => $project->fresh()->load(['photos', 'histories', 'documents']),
        ]);
    }

    /** Admin: delete a project (photos, history and documents cascade). */
    public function destroy(int $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        foreach ($project->photos as $photo) {
            $photo->removeWithFile();
        }
        foreach ($project->documents as $document) {
            $document->removeWithFile();
        }

        $project->delete();

        return response()->json(null, 204);
    }

    /** Admin: move a project up or down in the public ordering. */
    public function reorder(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'direction' => ['required', Rule::in(['up', 'down'])],
        ]);

        $project = Project::findOrFail($id);
        $ordered = Project::all()->pluck('id')->values();
        $index = $ordered->search($project->id);
        $swapIndex = $data['direction'] === 'up' ? $index - 1 : $index + 1;

        if ($index === false || $swapIndex < 0 || $swapIndex >= $ordered->count()) {
            return response()->json(['data' => Project::all()]);
        }

        $a = $ordered[$index];
        $b = $ordered[$swapIndex];

        $aOrder = Project::find($a)->sort_order;
        $bOrder = Project::find($b)->sort_order;

        $this->updateOrders([
            $a => $bOrder,
            $b => $aOrder,
        ]);

        return response()->json(['data' => Project::all()]);
    }

    /** Admin: set a single project as featured (clearing the rest). */
    public function setFeatured(Request $request, int $id): JsonResponse
    {
        Project::query()->update(['featured' => false]);
        Project::findOrFail($id)->update(['featured' => true]);

        return response()->json(['data' => Project::all()]);
    }

    /* ---- Admin: project photography ---- */

    /** Admin: upload one or more project photos. */
    public function storePhotos(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        $data = $request->validate([
            'photos' => ['required', 'array', 'min:1', 'max:20'],
            'photos.*' => ['required', 'file', 'image', 'max:8192'],
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $captions = (array) $request->input('captions', []);
        $created = [];
        $next = (int) ($project->photos()->max('sort_order') ?? 0);
        $hasCover = $project->photos()->where('is_cover', true)->exists();

        foreach ($request->file('photos') as $index => $file) {
            $photo = $project->photos()->create([
                'path' => $file->store("project-photos/{$project->id}", 'public'),
                'original_name' => $file->getClientOriginalName(),
                'caption' => $captions[$index] ?? $data['caption'] ?? null,
                'sort_order' => ++$next,
                // The first uploaded photo becomes the cover automatically.
                'is_cover' => ! $hasCover && $index === 0,
            ]);

            if ($photo->is_cover) {
                $hasCover = true;
            }

            $created[] = $photo->append('url');
        }

        return response()->json(['data' => $created], 201);
    }

    /** Admin: update a photo's caption. */
    public function updatePhoto(Request $request, int $id, int $photoId): JsonResponse
    {
        $photo = $this->photo($id, $photoId);

        $data = $request->validate([
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $photo->update($data);

        return response()->json(['data' => $photo->append('url')]);
    }

    /** Admin: delete a photo (and its file), promoting a new cover if needed. */
    public function destroyPhoto(int $id, int $photoId): JsonResponse
    {
        $photo = $this->photo($id, $photoId);
        $wasCover = $photo->is_cover;
        $photo->removeWithFile();

        if ($wasCover) {
            $photo->project->photos()->first()?->setCover();
        }

        return response()->json(null, 204);
    }

    /** Admin: promote a photo to be the project cover. */
    public function setPhotoCover(int $id, int $photoId): JsonResponse
    {
        $photo = $this->photo($id, $photoId);
        $photo->setCover();

        return response()->json(['data' => $photo->append('url')]);
    }

    /** Admin: move a photo up or down within the gallery order. */
    public function reorderPhotos(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        $data = $request->validate([
            'photo_id' => ['required', 'integer'],
            'direction' => ['required', Rule::in(['up', 'down'])],
        ]);

        $photo = $this->photo($id, (int) $data['photo_id']);
        $ordered = $project->photos()->pluck('id')->values();
        $index = $ordered->search($photo->id);
        $swapIndex = $data['direction'] === 'up' ? $index - 1 : $index + 1;

        if ($index !== false && $swapIndex >= 0 && $swapIndex < $ordered->count()) {
            $a = $ordered[$index];
            $b = $ordered[$swapIndex];

            $aOrder = ProjectPhoto::find($a)->sort_order;
            $bOrder = ProjectPhoto::find($b)->sort_order;

            ProjectPhoto::whereKey($a)->update(['sort_order' => $bOrder]);
            ProjectPhoto::whereKey($b)->update(['sort_order' => $aOrder]);
        }

        return response()->json(['data' => $project->photos()->get()->append('url')]);
    }

    /* ---- Admin: project history timeline ---- */

    /** Admin: add a dated entry to the project history. */
    public function storeHistory(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        $data = $this->historyRules($request);
        $history = $project->histories()->create([
            ...$data,
            'sort_order' => (int) ($project->histories()->max('sort_order') ?? 0) + 1,
        ]);

        return response()->json(['data' => $history], 201);
    }

    /** Admin: update a history entry. */
    public function updateHistory(Request $request, int $id, int $historyId): JsonResponse
    {
        $history = $this->history($id, $historyId);
        $history->update($this->historyRules($request, partial: true));

        return response()->json(['data' => $history->fresh()]);
    }

    /** Admin: delete a history entry. */
    public function destroyHistory(int $id, int $historyId): JsonResponse
    {
        $this->history($id, $historyId)->delete();

        return response()->json(null, 204);
    }

    /* ---- Admin: project documents ---- */

    /** Admin: upload a project document. */
    public function storeDocument(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        $data = $request->validate([
            'document' => ['required', 'file', 'max:20480', 'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx'],
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        $file = $request->file('document');

        $document = $project->documents()->create([
            'path' => $file->store("project-documents/{$project->id}", 'public'),
            'original_name' => $file->getClientOriginalName(),
            'title' => $data['title'] ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'file_size' => $file->getSize(),
            'mime' => $file->getMimeType(),
            'sort_order' => (int) ($project->documents()->max('sort_order') ?? 0) + 1,
        ]);

        return response()->json(['data' => $document->append('url')], 201);
    }

    /** Admin: delete a project document (and its file). */
    public function destroyDocument(int $id, int $documentId): JsonResponse
    {
        $this->document($id, $documentId)->removeWithFile();

        return response()->json(null, 204);
    }

    /* ---- Admin: bulk data tools (existing behaviour) ---- */

    /** Admin: restore the seeded placeholder projects (wipes overrides). */
    public function reset(Request $request): JsonResponse
    {
        Project::query()->delete();
        $seeder = new ProjectSeeder;
        $seeder->run();

        return response()->json(['data' => Project::all()]);
    }

    /** Admin: bulk-replace all projects from an exported backup. */
    public function import(Request $request): JsonResponse
    {
        $data = $request->validate([
            'projects' => ['sometimes', 'array'],
            'projects.*.title' => ['nullable', 'string', 'max:255'],
            'projects.*.slug' => ['nullable', 'string', 'max:255'],
            'projects.*.category' => ['nullable', 'string', 'max:255'],
            'projects.*.year' => ['nullable', 'string', 'max:20'],
            'projects.*.location' => ['nullable', 'string', 'max:255'],
            'projects.*.region' => ['nullable', 'string', 'max:255'],
            'projects.*.status' => ['nullable', 'string', 'max:50'],
            'projects.*.client' => ['nullable', 'string', 'max:255'],
            'projects.*.consultant' => ['nullable', 'string', 'max:255'],
            'projects.*.contractor' => ['nullable', 'string', 'max:255'],
            'projects.*.contract_amount' => ['nullable', 'numeric'],
            'projects.*.currency' => ['nullable', 'string', 'max:8'],
            'projects.*.contract_date' => ['nullable', 'date'],
            'projects.*.start_date' => ['nullable', 'date'],
            'projects.*.completion_date' => ['nullable', 'date'],
            'projects.*.acceptance_date' => ['nullable', 'date'],
            'projects.*.physical_progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'projects.*.financial_progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'projects.*.description' => ['nullable', 'string'],
            'projects.*.overview' => ['nullable', 'string'],
            'projects.*.challenge' => ['nullable', 'string'],
            'projects.*.approach' => ['nullable', 'string'],
            'projects.*.result' => ['nullable', 'string'],
            'projects.*.visual' => ['nullable', 'string', 'max:50'],
            'projects.*.variant' => ['nullable', 'integer'],
            'projects.*.image' => ['nullable', 'string', 'max:2048'],
            'projects.*.size' => ['nullable', 'string', 'max:50'],
            'projects.*.featured' => ['nullable', 'boolean'],
            'projects.*.scope' => ['nullable', 'array'],
            'projects.*.gallery' => ['nullable', 'array'],
        ]);

        Project::query()->delete();

        $order = 0;
        foreach ($data['projects'] ?? [] as $row) {
            $slug = ! empty($row['slug'])
                ? $row['slug']
                : $this->uniqueSlug(Str::slug($row['title'] ?: 'project'));

            Project::create([
                ...$this->importableFields($row),
                'slug' => $slug,
                'featured' => isset($row['featured'])
                    ? filter_var($row['featured'], FILTER_VALIDATE_BOOLEAN)
                    : false,
                'scope' => is_array($row['scope'] ?? null) ? $row['scope'] : null,
                'gallery' => is_array($row['gallery'] ?? null) ? $row['gallery'] : null,
                'sort_order' => $order++,
            ]);
        }

        return response()->json(['data' => Project::all()], 201);
    }

    /* ---- Internals ---- */

    /**
     * Normalise an imported row into model attributes, coercing JSON columns
     * that may arrive as strings.
     *
     * @param  array<string, mixed>  $row
     * @return array<string, mixed>
     */
    private function importableFields(array $row): array
    {
        $fields = [
            'title', 'category', 'year', 'location', 'region', 'client', 'consultant',
            'contractor', 'currency', 'contract_date', 'start_date', 'completion_date',
            'acceptance_date', 'physical_progress', 'financial_progress', 'description',
            'overview', 'challenge', 'approach', 'result', 'visual', 'variant', 'image', 'size',
        ];

        $attributes = array_intersect_key($row, array_flip($fields));

        $attributes['status'] = ProjectStatus::normalise($row['status'] ?? null)->value;

        if (array_key_exists('contract_amount', $row) && $row['contract_amount'] !== null) {
            $attributes['contract_amount'] = (float) $row['contract_amount'];
        }

        return array_filter($attributes, static fn ($value): bool => $value !== null);
    }

    /**
     * Shared validation + normalisation for store/update.
     *
     * @param  bool  $partial  True on update, so absent fields are left untouched.
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Project $existing = null, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        $data = $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'category' => [$required, 'string', 'max:255'],
            'year' => ['nullable', 'string', 'max:20'],
            'location' => ['nullable', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(ProjectStatus::class)],
            'client' => ['nullable', 'string', 'max:255'],
            'consultant' => ['nullable', 'string', 'max:255'],
            'contractor' => ['nullable', 'string', 'max:255'],
            'contract_amount' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:8'],
            'contract_date' => ['nullable', 'date'],
            'start_date' => ['nullable', 'date'],
            'completion_date' => ['nullable', 'date'],
            'acceptance_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'physical_progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'financial_progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'description' => ['nullable', 'string'],
            'overview' => ['nullable', 'string'],
            'challenge' => ['nullable', 'string'],
            'approach' => ['nullable', 'string'],
            'result' => ['nullable', 'string'],
            'visual' => ['nullable', 'string', 'max:50'],
            'variant' => ['nullable', 'integer'],
            'image' => ['nullable', 'string', 'max:2048'],
            'size' => ['nullable', 'string', 'max:50'],
            'featured' => ['nullable', 'boolean'],
            'scope' => ['nullable', 'array'],
            'scope.*.key' => ['nullable', 'string'],
            'scope.*.value' => ['nullable', 'string'],
            'gallery' => ['nullable', 'array'],
            'gallery.*.visual' => ['nullable', 'string'],
            'gallery.*.variant' => ['nullable', 'integer'],
            'gallery.*.alt' => ['nullable', 'string'],
        ]);

        // Derive a unique slug from the title when absent.
        if (empty($data['slug']) && ! empty($data['title'])) {
            $data['slug'] = $this->uniqueSlug(Str::slug($data['title']), $existing?->id);
        }

        // Normalise booleans / json arrays that may arrive as strings.
        if (isset($data['featured'])) {
            $data['featured'] = filter_var($data['featured'], FILTER_VALIDATE_BOOLEAN);
        }
        foreach (['scope', 'gallery'] as $jsonField) {
            if (isset($data[$jsonField]) && is_string($data[$jsonField])) {
                $data[$jsonField] = json_decode($data[$jsonField], true);
            }
        }

        return $data;
    }

    /**
     * Validation rules for a history timeline entry.
     *
     * @return array<string, array<int, string>>
     */
    private function historyRules(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'occurred_on' => [$required, 'date'],
            'title' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    /** Resolve a photo scoped to its project. */
    private function photo(int $projectId, int $photoId): ProjectPhoto
    {
        return ProjectPhoto::query()
            ->where('project_id', $projectId)
            ->findOrFail($photoId);
    }

    /** Resolve a history entry scoped to its project. */
    private function history(int $projectId, int $historyId): ProjectHistory
    {
        return ProjectHistory::query()
            ->where('project_id', $projectId)
            ->findOrFail($historyId);
    }

    /** Resolve a document scoped to its project. */
    private function document(int $projectId, int $documentId): ProjectDocument
    {
        return ProjectDocument::query()
            ->where('project_id', $projectId)
            ->findOrFail($documentId);
    }

    private function uniqueSlug(string $base, ?int $excludeId = null): string
    {
        $base = $base ?: 'project';
        $candidate = $base;
        $i = 2;
        while (Project::where('slug', $candidate)->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))->exists()) {
            $candidate = $base.'-'.$i;
            $i++;
        }

        return $candidate;
    }

    /**
     * @param  array<int, int>  $assignments
     */
    private function updateOrders(array $assignments): void
    {
        foreach ($assignments as $id => $order) {
            Project::whereKey($id)->update(['sort_order' => $order]);
        }
    }
}
