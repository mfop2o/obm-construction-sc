<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CareerBenefit;
use App\Models\CareerValue;
use App\Models\Opening;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CareerController extends Controller
{
    /** Public: all careers content (openings + values + benefits). */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'openings' => Opening::query()->active()->get(),
                'values' => CareerValue::all(),
                'benefits' => CareerBenefit::all(),
            ],
        ]);
    }

    /** Public: a single vacancy with its advertisement details. */
    public function show(int $id): JsonResponse
    {
        $opening = Opening::query()->findOrFail($id);

        return response()->json([
            'data' => $opening->append(['is_accepting_applications']),
        ]);
    }

    /** Admin: store an opening. */
    public function storeOpening(Request $request): JsonResponse
    {
        $data = $request->validate($this->openingRules());

        $min = Opening::min('sort_order');
        $data['sort_order'] = ($min ?? 0) - 1;
        $opening = Opening::create($data);

        return response()->json(['data' => $opening], 201);
    }

    /** Admin: update an opening. */
    public function updateOpening(Request $request, int $id): JsonResponse
    {
        $opening = Opening::findOrFail($id);

        $rules = $this->openingRules();
        $rules['title'] = ['sometimes', 'required', 'string', 'max:255'];

        $data = $request->validate($rules);

        $opening->update($data);

        return response()->json(['data' => $opening->fresh()]);
    }

    /** Admin: delete an opening. */
    public function destroyOpening(int $id): JsonResponse
    {
        Opening::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    /**
     * Validation rules for a vacancy, including the advertisement details the
     * applicant sees and the HR team maintains.
     *
     * @return array<string, array<int, string>>
     */
    private function openingRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:50'],
            'blurb' => ['nullable', 'string'],
            'qualification' => ['nullable', 'string', 'max:2000'],
            'responsibilities' => ['nullable', 'string', 'max:3000'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:70'],
            'deadline' => ['nullable', 'date', 'after:today'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /** Admin: store a career value. */
    public function storeValue(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'text' => ['required', 'string'],
        ]);

        $min = CareerValue::min('sort_order');
        $data['sort_order'] = ($min ?? 0) - 1;
        $value = CareerValue::create($data);

        return response()->json(['data' => $value], 201);
    }

    /** Admin: update a career value. */
    public function updateValue(Request $request, int $id): JsonResponse
    {
        $value = CareerValue::findOrFail($id);

        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'text' => ['sometimes', 'required', 'string'],
        ]);

        $value->update($data);

        return response()->json(['data' => $value->fresh()]);
    }

    /** Admin: delete a career value. */
    public function destroyValue(int $id): JsonResponse
    {
        CareerValue::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    /** Admin: store a career benefit. */
    public function storeBenefit(Request $request): JsonResponse
    {
        $data = $request->validate([
            'text' => ['required', 'string', 'max:1000'],
        ]);

        $min = CareerBenefit::min('sort_order');
        $data['sort_order'] = ($min ?? 0) - 1;
        $benefit = CareerBenefit::create($data);

        return response()->json(['data' => $benefit], 201);
    }

    /** Admin: update a career benefit. */
    public function updateBenefit(Request $request, int $id): JsonResponse
    {
        $benefit = CareerBenefit::findOrFail($id);

        $data = $request->validate([
            'text' => ['sometimes', 'required', 'string', 'max:1000'],
        ]);

        $benefit->update($data);

        return response()->json(['data' => $benefit->fresh()]);
    }

    /** Admin: delete a career benefit. */
    public function destroyBenefit(int $id): JsonResponse
    {
        CareerBenefit::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
