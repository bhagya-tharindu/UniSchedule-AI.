<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeetingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'start_time' => $this->start_time?->toIso8601String(),
            'end_time' => $this->end_time?->toIso8601String(),
            'status' => $this->status,
            'meeting_mode' => $this->meeting_mode,
            'meeting_url' => $this->meeting_url,
            'organizer' => new UserResource($this->whenLoaded('organizer')),
            'room' => $this->whenLoaded('room', fn () => [
                'id' => $this->room->id,
                'name' => $this->room->name,
                'building' => $this->room->building,
                'capacity' => $this->room->capacity,
            ]),
            'participants' => $this->whenLoaded('participants', fn () => $this->participants->map(fn ($p) => [
                'user' => new UserResource($p->user),
                'response' => $p->response,
            ])),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
