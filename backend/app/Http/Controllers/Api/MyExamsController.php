<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseExamPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyExamsController extends Controller
{
    /**
     * Exam periods for courses the current user is enrolled in.
     */
    public function index(Request $request): JsonResponse
    {
        $courseIds = $request->user()->courses()->pluck('courses.id');

        $periods = CourseExamPeriod::query()
            ->with('course')
            ->whereIn('course_id', $courseIds)
            ->orderByDesc('valid_from')
            ->get();

        return response()->json([
            'data' => $periods->map(fn (CourseExamPeriod $p) => [
                'id' => $p->id,
                'course_id' => $p->course_id,
                'course_code' => $p->course?->code,
                'course_name' => $p->course?->name,
                'name' => $p->name,
                'valid_from' => $p->valid_from?->toDateString(),
                'valid_to' => $p->valid_to?->toDateString(),
                'is_active' => $p->is_active,
            ]),
        ]);
    }
}
