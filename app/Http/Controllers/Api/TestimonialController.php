<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /** Public: list all testimonials (ordered). */
    public function index(): JsonResponse
    {
        return response()->json(['data' => Testimonial::all()]);
    }

    /** Admin: create a testimonial. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'quote' => ['required', 'string', 'max:2000'],
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'featured' => ['nullable', 'boolean'],
        ]);

        $min = Testimonial::min('sort_order');
        $data['sort_order'] = ($min ?? 0) - 1;
        $testimonial = Testimonial::create($data);

        return response()->json(['data' => $testimonial], 201);
    }

    /** Admin: update a testimonial. */
    public function update(Request $request, int $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);

        $data = $request->validate([
            'quote' => ['sometimes', 'required', 'string', 'max:2000'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'featured' => ['nullable', 'boolean'],
        ]);

        $testimonial->update($data);

        return response()->json(['data' => $testimonial->fresh()]);
    }

    /** Admin: delete a testimonial. */
    public function destroy(int $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return response()->json(null, 204);
    }
}