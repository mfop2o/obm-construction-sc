<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /** Admin: list all administrator accounts. */
    public function index(): JsonResponse
    {
        return response()->json(['data' => User::all()]);
    }

    /** Admin: create an administrator account. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['nullable', Rule::in(['admin', 'manager'])],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'] ?? 'admin',
            'email_verified_at' => now(),
        ]);

        return response()->json(['data' => $user], 201);
    }

    /** Admin: update an administrator account. */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['nullable', Rule::in(['admin', 'manager'])],
        ]);

        if (isset($data['password'])) {
            $user->password = $data['password'];
        }
        $user->fill(collect($data)->except('password')->all());
        $user->save();

        return response()->json(['data' => $user->fresh()]);
    }

    /** Admin: delete an administrator account (except yourself). */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if ($id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        User::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}