<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactSetting;
use App\Models\Office;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactSettingsController extends Controller
{
    /** Public: the company contact details + offices used by the Contact page. */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'settings' => ContactSetting::firstOrCreateDefault(),
                'offices' => Office::all(),
            ],
        ]);
    }

    /** Admin: update the single-row company contact details. */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'address_line_1' => ['required', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
        ]);

        $settings = ContactSetting::firstOrCreateDefault();
        $settings->update($data);

        return response()->json(['data' => $settings->fresh()]);
    }

    /** Admin: create an office. */
    public function storeOffice(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
        ]);

        $min = Office::min('sort_order');
        $data['sort_order'] = ($min ?? 0) - 1;
        $office = Office::create($data);

        return response()->json(['data' => $office], 201);
    }

    /** Admin: update an office. */
    public function updateOffice(Request $request, int $id): JsonResponse
    {
        $office = Office::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
        ]);

        $office->update($data);

        return response()->json(['data' => $office->fresh()]);
    }

    /** Admin: delete an office. */
    public function destroyOffice(int $id): JsonResponse
    {
        $office = Office::findOrFail($id);
        $office->delete();

        return response()->json(null, 204);
    }
}