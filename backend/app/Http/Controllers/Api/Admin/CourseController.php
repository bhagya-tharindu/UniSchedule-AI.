<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Course;
use App\Models\CourseExamPeriod;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(): JsonResponse
    {
        $courses = Course::query()
            ->withCount('users')
            ->orderBy('code')
            ->get();

        return response()->json([
            'data' => $courses->map(fn (Course $c) => $this->transformCourse($c)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:courses,code'],
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);
        $course = Course::create($data);

        return response()->json(['data' => $this->transformCourse($course->loadCount('users'))], 201);
    }

    public function show(Course $course): JsonResponse
    {
        $course->load(['users', 'examPeriods']);

        return response()->json([
            'data' => [
                ...$this->transformCourse($course),
                'users' => UserResource::collection($course->users),
                'exam_periods' => $course->examPeriods
                    ->sortByDesc('valid_from')
                    ->values()
                    ->map(fn (CourseExamPeriod $p) => $this->transformPeriod($p)),
            ],
        ]);
    }

    public function update(Request $request, Course $course): JsonResponse
    {
        $data = $request->validate([
            'code' => ['sometimes', 'string', 'max:50', 'unique:courses,code,'.$course->id],
            'name' => ['sometimes', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        $course->update($data);

        return response()->json(['data' => $this->transformCourse($course->fresh()->loadCount('users'))]);
    }

    public function destroy(Course $course): JsonResponse
    {
        $course->delete();

        return response()->json(['message' => 'Course deleted.']);
    }

    public function enrolUser(Request $request, Course $course): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $course->users()->syncWithoutDetaching([$data['user_id']]);

        return response()->json([
            'data' => UserResource::collection($course->fresh()->users),
        ]);
    }

    public function removeUser(Course $course, User $user): JsonResponse
    {
        $course->users()->detach($user->id);

        return response()->json(['message' => 'User removed from course.']);
    }

    public function storeExamPeriod(Request $request, Course $course): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'valid_from' => ['required', 'date'],
            'valid_to' => ['required', 'date', 'after_or_equal:valid_from'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);
        $period = $course->examPeriods()->create($data);

        return response()->json(['data' => $this->transformPeriod($period)], 201);
    }

    public function updateExamPeriod(Request $request, CourseExamPeriod $courseExamPeriod): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'valid_from' => ['sometimes', 'date'],
            'valid_to' => ['sometimes', 'date', 'after_or_equal:valid_from'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        $courseExamPeriod->update($data);

        return response()->json(['data' => $this->transformPeriod($courseExamPeriod->fresh())]);
    }

    public function destroyExamPeriod(CourseExamPeriod $courseExamPeriod): JsonResponse
    {
        $courseExamPeriod->delete();

        return response()->json(['message' => 'Course exam period deleted.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformCourse(Course $course): array
    {
        return [
            'id' => $course->id,
            'code' => $course->code,
            'name' => $course->name,
            'is_active' => $course->is_active,
            'users_count' => $course->users_count ?? $course->users()->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function transformPeriod(CourseExamPeriod $period): array
    {
        return [
            'id' => $period->id,
            'course_id' => $period->course_id,
            'name' => $period->name,
            'valid_from' => $period->valid_from?->toDateString(),
            'valid_to' => $period->valid_to?->toDateString(),
            'is_active' => $period->is_active,
        ];
    }
}
