<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /** Public: submit a message through the contact form. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'project_type' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        $contact = Contact::create($data);

        return response()->json(['data' => $contact->refresh()], 201);
    }

    /** Admin: list all contact submissions, newest first. */
    public function index(Request $request): JsonResponse
    {
        $contacts = Contact::query()
            ->when($request->boolean('unread'), fn ($q) => $q->where('read', false))
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $contacts]);
    }

    /** Admin: mark a submission as read/unread. */
    public function updateRead(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'read' => ['required', 'boolean'],
        ]);

        $contact = Contact::findOrFail($id);
        $contact->update(['read' => $data['read']]);

        return response()->json(['data' => $contact]);
    }

    /** Admin: delete a contact submission. */
    public function destroy(int $id): JsonResponse
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json(null, 204);
    }
}