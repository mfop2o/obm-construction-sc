<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Database\Seeders\ProjectSeeder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /** Public: list all projects (ordered). */
    public function index(): JsonResponse
    {
        return response()->json(['data' => Project::all()]);
    }

    /** Public: show a single project. */
    public function show(string $slug): JsonResponse
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        return response()->json(['data' => $project]);
    }

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
        $data = $this->validated($request, $project);
        $project->update($data);

        return response()->json(['data' => $project->fresh()]);
    }

    /** Admin: delete a project. */
    public function destroy(int $id): JsonResponse
    {
        $project = Project::findOrFail($id);
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
            'projects.*.status' => ['nullable', 'string', 'max:50'],
            'projects.*.client' => ['nullable', 'string', 'max:255'],
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
            $scope = $row['scope'] ?? [];
            $gallery = $row['gallery'] ?? [];
            $featured = isset($row['featured'])
                ? filter_var($row['featured'], FILTER_VALIDATE_BOOLEAN)
                : false;
            $slug = ! empty($row['slug'])
                ? $row['slug']
                : $this->uniqueSlug(Str::slug($row['title'] ?: 'project'));

            Project::create([
                'slug' => $slug,
                'title' => $row['title'] ?? '',
                'category' => $row['category'] ?? 'Commercial',
                'year' => $row['year'] ?? null,
                'location' => $row['location'] ?? null,
                'status' => $row['status'] ?? 'Upcoming',
                'client' => $row['client'] ?? null,
                'description' => $row['description'] ?? null,
                'overview' => $row['overview'] ?? null,
                'challenge' => $row['challenge'] ?? null,
                'approach' => $row['approach'] ?? null,
                'result' => $row['result'] ?? null,
                'visual' => $row['visual'] ?? 'facade',
                'variant' => $row['variant'] ?? null,
                'image' => $row['image'] ?? null,
                'size' => $row['size'] ?? 'standard',
                'featured' => $featured,
                'scope' => is_array($scope) ? $scope : null,
                'gallery' => is_array($gallery) ? $gallery : null,
                'sort_order' => $order,
            ]);
            $order++;
        }

        return response()->json(['data' => Project::all()], 201);
    }

    /** Shared validation + normalisation for store/update. */
    private function validated(Request $request, ?Project $existing = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'year' => ['nullable', 'string', 'max:20'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:50'],
            'client' => ['nullable', 'string', 'max:255'],
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
        if (empty($data['slug'])) {
            $base = Str::slug($data['title'] ?: 'project');
            $data['slug'] = $this->uniqueSlug($base, $existing?->id);
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

    private function uniqueSlug(string $base, ?int $excludeId = null): string
    {
        $candidate = $base;
        $i = 2;
        while (Project::where('slug', $candidate)->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))->exists()) {
            $candidate = $base.'-'.$i;
            $i++;
        }

        return $candidate;
    }

    private function updateOrders(array $assignments): void
    {
        foreach ($assignments as $id => $order) {
            Project::whereKey($id)->update(['sort_order' => $order]);
        }
    }
}
