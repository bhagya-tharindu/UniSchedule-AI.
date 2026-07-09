<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\StoreTimetableSlotRequest;
use App\Http\Requests\Academic\UpdateTimetableSlotRequest;
use App\Models\TimetableSlot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimetableSlotController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = TimetableSlot::query()->orderBy('day_of_week')->orderBy('start_time');

        if ($request->user()->isAdmin() && $request->filled('user_id')) {
            $query->where('user_id', (int) $request->query('user_id'));
        } else {
            $query->where('user_id', $request->user()->id);
        }

        $slots = $query->get();

        return response()->json([
            'data' => $slots->map(fn (TimetableSlot $slot) => $this->transform($slot)),
        ]);
    }

    public function store(StoreTimetableSlotRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active', true);
        $data['start_time'] = $this->normalizeTime($data['start_time']);
        $data['end_time'] = $this->normalizeTime($data['end_time']);

        $slot = TimetableSlot::create($data);

        return response()->json(['data' => $this->transform($slot)], 201);
    }

    public function update(UpdateTimetableSlotRequest $request, TimetableSlot $timetableSlot): JsonResponse
    {
        $data = $request->validated();
        if (isset($data['start_time'])) {
            $data['start_time'] = $this->normalizeTime($data['start_time']);
        }
        if (isset($data['end_time'])) {
            $data['end_time'] = $this->normalizeTime($data['end_time']);
        }
        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        $timetableSlot->update($data);

        return response()->json(['data' => $this->transform($timetableSlot->fresh())]);
    }

    public function destroy(TimetableSlot $timetableSlot): JsonResponse
    {
        if (! request()->user()?->isAdmin()) {
            abort(403, 'Only admins can delete timetable slots.');
        }

        $timetableSlot->delete();

        return response()->json(['message' => 'Timetable slot deleted.']);
    }

    private function normalizeTime(string $time): string
    {
        return strlen($time) === 5 ? $time.':00' : $time;
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(TimetableSlot $slot): array
    {
        return [
            'id' => $slot->id,
            'user_id' => $slot->user_id,
            'day_of_week' => $slot->day_of_week,
            'start_time' => substr((string) $slot->start_time, 0, 5),
            'end_time' => substr((string) $slot->end_time, 0, 5),
            'title' => $slot->title,
            'valid_from' => $slot->valid_from?->toDateString(),
            'valid_to' => $slot->valid_to?->toDateString(),
            'is_active' => $slot->is_active,
        ];
    }
}
