<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutSetting;
use App\Models\AboutValue;
use App\Models\Milestone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    /** Public: about settings + values + milestones. */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'settings' => AboutSetting::firstOrCreateDefault(),
                'values' => AboutValue::all(),
                'milestones' => Milestone::all(),
            ],
        ]);
    }

    /** Admin: update the single-row mission/vision. */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'mission' => ['required', 'string'],
            'vision' => ['required', 'string'],
        ]);

        $settings = AboutSetting::firstOrCreateDefault();
        $settings->update($data);

        return response()->json(['data' => $settings->fresh()]);
    }

    /** Admin: store a value. */
    public function storeValue(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
        ]);

        $min = AboutValue::min('sort_order');
        $data['sort_order'] = ($min ?? 0) - 1;
        $value = AboutValue::create($data);

        return response()->json(['data' => $value], 201);
    }

    /** Admin: update a value. */
    public function updateValue(Request $request, int $id): JsonResponse
    {
        $value = AboutValue::findOrFail($id);

        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
        ]);

        $value->update($data);

        return response()->json(['data' => $value->fresh()]);
    }

    /** Admin: delete a value. */
    public function destroyValue(int $id): JsonResponse
    {
        AboutValue::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    /** Admin: store a milestone. */
    public function storeMilestone(Request $request): JsonResponse
    {
        $data = $request->validate([
            'year' => ['required', 'string', 'max:20'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $min = Milestone::min('sort_order');
        $data['sort_order'] = ($min ?? 0) - 1;
        $milestone = Milestone::create($data);

        return response()->json(['data' => $milestone], 201);
    }

    /** Admin: update a milestone. */
    public function updateMilestone(Request $request, int $id): JsonResponse
    {
        $milestone = Milestone::findOrFail($id);

        $data = $request->validate([
            'year' => ['sometimes', 'required', 'string', 'max:20'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $milestone->update($data);

        return response()->json(['data' => $milestone->fresh()]);
    }

    /** Admin: delete a milestone. */
    public function destroyMilestone(int $id): JsonResponse
    {
        Milestone::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}