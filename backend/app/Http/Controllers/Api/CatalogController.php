<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function users(Request $request): JsonResponse
    {
        $users = User::query()
            ->where('id', '!=', $request->user()->id)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        return response()->json([
            'data' => UserResource::collection($users),
        ]);
    }

    public function rooms(): JsonResponse
    {
        $rooms = Room::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'building', 'capacity']);

        return response()->json([
            'data' => $rooms->map(fn (Room $room) => [
                'id' => $room->id,
                'name' => $room->name,
                'building' => $room->building,
                'capacity' => $room->capacity,
            ]),
        ]);
    }
}
