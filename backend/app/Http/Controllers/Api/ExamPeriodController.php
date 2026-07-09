<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\StoreExamPeriodRequest;
use App\Http\Requests\Academic\UpdateExamPeriodRequest;
use App\Models\ConstraintRule;
use Illuminate\Http\JsonResponse;

class ExamPeriodController extends Controller
{
    public function index(): JsonResponse
    {
        $periods = ConstraintRule::query()
            ->where('rule_type', 'exam_blackout')
            ->orderByDesc('valid_from')
            ->get();

        return response()->json([
            'data' => $periods->map(fn (ConstraintRule $rule) => $this->transform($rule)),
        ]);
    }

    public function store(StoreExamPeriodRequest $request): JsonResponse
    {
        $rule = ConstraintRule::create([
            'name' => $request->validated('name'),
            'rule_type' => 'exam_blackout',
            'valid_from' => $request->validated('valid_from'),
            'valid_to' => $request->validated('valid_to'),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return response()->json(['data' => $this->transform($rule)], 201);
    }

    public function update(UpdateExamPeriodRequest $request, ConstraintRule $examPeriod): JsonResponse
    {
        if ($examPeriod->rule_type !== 'exam_blackout') {
            abort(404);
        }

        $examPeriod->fill($request->validated());
        if ($request->has('is_active')) {
            $examPeriod->is_active = $request->boolean('is_active');
        }
        $examPeriod->save();

        return response()->json(['data' => $this->transform($examPeriod)]);
    }

    public function destroy(ConstraintRule $examPeriod): JsonResponse
    {
        if ($examPeriod->rule_type !== 'exam_blackout') {
            abort(404);
        }

        if (! request()->user()?->isAdmin()) {
            abort(403, 'Only admins can delete exam periods.');
        }

        $examPeriod->delete();

        return response()->json(['message' => 'Exam period deleted.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(ConstraintRule $rule): array
    {
        return [
            'id' => $rule->id,
            'name' => $rule->name,
            'rule_type' => $rule->rule_type,
            'valid_from' => $rule->valid_from?->toDateString(),
            'valid_to' => $rule->valid_to?->toDateString(),
            'is_active' => $rule->is_active,
        ];
    }
}
