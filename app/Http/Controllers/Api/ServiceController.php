<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /** Public: list all services (ordered). */
    public function index(): JsonResponse
    {
        return response()->json(['data' => Service::all()]);
    }

    /** Admin: create a service. */
    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $min = Service::min('sort_order');
        $data['sort_order'] = ($min ?? 0) - 1;
        $service = Service::create($data);

        return response()->json(['data' => $service], 201);
    }

    /** Admin: update a service. */
    public function update(Request $request, int $id): JsonResponse
    {
        $service = Service::findOrFail($id);
        $service->update($this->validated($request, true));

        return response()->json(['data' => $service->fresh()]);
    }

    /** Admin: delete a service. */
    public function destroy(int $id): JsonResponse
    {
        Service::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    /** Shared validation + normalisation for store/update. */
    private function validated(Request $request, bool $partial = false): array
    {
        $data = $request->validate([
            'title' => [($partial ? 'sometimes' : null), 'required', 'string', 'max:255'],
            'description' => [($partial ? 'sometimes' : null), 'required', 'string', 'max:1000'],
            'overview' => [($partial ? 'sometimes' : null), 'required', 'string'],
            'image' => ['nullable', 'string', 'max:50'],
            'image_key' => ['nullable', 'string', 'max:255'],
            'capabilities' => ['nullable', 'array'],
            'capabilities.*' => ['string', 'max:255'],
        ]);

        if (isset($data['capabilities']) && is_string($data['capabilities'])) {
            $data['capabilities'] = json_decode($data['capabilities'], true);
        }

        return $data;
    }
}