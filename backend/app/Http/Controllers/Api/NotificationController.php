<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (DatabaseNotification $notification) => $this->format($notification));

        return response()->json([
            'data' => $notifications,
            'unread_count' => $user->unreadNotifications()->count(),
        ]);
    }

    public function markRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        if ($notification->read_at === null) {
            $notification->markAsRead();
        }

        return response()->json([
            'data' => $this->format($notification->fresh()),
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'message' => 'All notifications marked as read.',
            'unread_count' => 0,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function format(DatabaseNotification $notification): array
    {
        $data = $notification->data;

        return [
            'id' => $notification->id,
            'type' => $data['type'] ?? $data['action'] ?? 'meeting',
            'title' => $data['title'] ?? 'Meeting update',
            'message' => $data['message'] ?? '',
            'meeting_id' => $data['meeting_id'] ?? null,
            'join_url' => $data['join_url'] ?? null,
            'read_at' => $notification->read_at?->toIso8601String(),
            'created_at' => $notification->created_at?->toIso8601String(),
        ];
    }
}
