<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\ParseNlpMeetingRequest;
use App\Http\Requests\Meeting\StoreMeetingRequest;
use App\Http\Requests\Meeting\UpdateMeetingRequest;
use App\Http\Resources\MeetingResource;
use App\Models\Meeting;
use App\Services\ClashDetectionService;
use App\Services\NlpSchedulingService;
use App\Services\SchedulingService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function __construct(
        private readonly SchedulingService $scheduling,
        private readonly ClashDetectionService $clashDetection,
        private readonly NlpSchedulingService $nlpScheduling,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $meetings = Meeting::query()
            ->with(['room', 'organizer', 'participants.user'])
            ->where(function ($q) use ($userId) {
                $q->where('organizer_id', $userId)
                    ->orWhereHas('participants', fn ($p) => $p->where('user_id', $userId));
            })
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => MeetingResource::collection($meetings),
        ]);
    }

    public function store(StoreMeetingRequest $request): JsonResponse
    {
        $meeting = $this->scheduling->createMeeting(
            $request->validated(),
            $request->user()->id,
        );

        return response()->json([
            'data' => new MeetingResource($meeting),
        ], 201);
    }

    public function show(Meeting $meeting): JsonResponse
    {
        $this->authorizeMeetingAccess($meeting);

        $meeting->load(['room', 'organizer', 'participants.user']);

        return response()->json([
            'data' => new MeetingResource($meeting),
        ]);
    }

    public function update(UpdateMeetingRequest $request, Meeting $meeting): JsonResponse
    {
        $this->authorizeMeetingAccess($meeting);

        if ($meeting->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Only the organizer can update this meeting.'], 403);
        }

        $meeting = $this->scheduling->updateMeeting($meeting, $request->validated());

        return response()->json([
            'data' => new MeetingResource($meeting),
        ]);
    }

    public function destroy(Request $request, Meeting $meeting): JsonResponse
    {
        $this->authorizeMeetingAccess($meeting);

        if ($meeting->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Only the organizer can cancel this meeting.'], 403);
        }

        $meeting = $this->scheduling->cancelMeeting($meeting);

        return response()->json([
            'data' => new MeetingResource($meeting),
        ]);
    }

    public function parseNlp(ParseNlpMeetingRequest $request): JsonResponse
    {
        $parsed = $this->nlpScheduling->parse(
            $request->validated('text'),
            $request->user(),
        );

        $payload = $parsed->toArray();
        $payload['has_clashes'] = false;
        $payload['clashes'] = [];
        $payload['suggestions'] = [];

        if ($parsed->intent === 'book' && $parsed->startTime && $parsed->endTime) {
            $tz = config('app.timezone');
            $start = Carbon::parse($parsed->startTime, $tz);
            $end = Carbon::parse($parsed->endTime, $tz);
            $participantIds = collect($parsed->participantIds)
                ->push($request->user()->id)
                ->unique()
                ->values()
                ->all();

            $clashes = $this->clashDetection->detect(
                $start,
                $end,
                $participantIds,
                $parsed->roomId,
            );

            $payload['has_clashes'] = ! empty($clashes);
            $payload['clashes'] = $clashes;

            if (! empty($clashes)) {
                $duration = $start->diffInMinutes($end);
                $payload['suggestions'] = $this->scheduling->suggestAlternativeSlots(
                    $start,
                    $duration,
                    $participantIds,
                    $parsed->roomId,
                )->all();
            }
        }

        return response()->json(['data' => $payload]);
    }

    public function checkClash(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'participant_ids' => ['nullable', 'array'],
            'participant_ids.*' => ['exists:users,id'],
            'room_id' => ['nullable', 'exists:rooms,id'],
            'exclude_meeting_id' => ['nullable', 'exists:meetings,id'],
        ]);

        $tz = config('app.timezone');
        $start = Carbon::parse($validated['start_time'], $tz);
        $end = Carbon::parse($validated['end_time'], $tz);
        $participantIds = collect($validated['participant_ids'] ?? [])
            ->push($request->user()->id)
            ->unique()
            ->values()
            ->all();

        $clashes = $this->clashDetection->detect(
            $start,
            $end,
            $participantIds,
            $validated['room_id'] ?? null,
            $validated['exclude_meeting_id'] ?? null,
        );

        $suggestions = collect();
        if (! empty($clashes)) {
            $duration = $start->diffInMinutes($end);
            $suggestions = $this->scheduling->suggestAlternativeSlots(
                $start,
                $duration,
                $participantIds,
                $validated['room_id'] ?? null,
            );
        }

        return response()->json([
            'has_clashes' => ! empty($clashes),
            'clashes' => $clashes,
            'suggestions' => $suggestions,
        ]);
    }

    private function authorizeMeetingAccess(Meeting $meeting): void
    {
        $userId = request()->user()?->id;

        $allowed = $meeting->organizer_id === $userId
            || $meeting->participants()->where('user_id', $userId)->exists();

        if (! $allowed) {
            abort(403, 'You do not have access to this meeting.');
        }
    }
}
