<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomeStat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomeStatController extends Controller
{
    /** Public: list all stats (ordered). */
    public function index(): JsonResponse
    {
        return response()->json(['data' => HomeStat::all()]);
    }

    /** Admin: create a stat. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'value' => ['required', 'integer', 'min:0'],
            'suffix' => ['nullable', 'string', 'max:20'],
        ]);

        $min = HomeStat::min('sort_order');
        $data['sort_order'] = ($min ?? 0) - 1;
        $stat = HomeStat::create($data);

        return response()->json(['data' => $stat], 201);
    }

    /** Admin: update a stat. */
    public function update(Request $request, int $id): JsonResponse
    {
        $stat = HomeStat::findOrFail($id);

        $data = $request->validate([
            'label' => ['sometimes', 'required', 'string', 'max:255'],
            'value' => ['sometimes', 'required', 'integer', 'min:0'],
            'suffix' => ['nullable', 'string', 'max:20'],
        ]);

        $stat->update($data);

        return response()->json(['data' => $stat->fresh()]);
    }

    /** Admin: delete a stat. */
    public function destroy(int $id): JsonResponse
    {
        HomeStat::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}