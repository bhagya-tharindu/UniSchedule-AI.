<?php

use App\Http\Controllers\Api\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\ExamPeriodController;
use App\Http\Controllers\Api\MeetingController;
use App\Http\Controllers\Api\MyExamsController;
use App\Http\Controllers\Api\TimetableSlotController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::get('/users', [CatalogController::class, 'users']);
        Route::get('/rooms', [CatalogController::class, 'rooms']);

        Route::get('/exam-periods', [ExamPeriodController::class, 'index']);
        Route::get('/my-exams', [MyExamsController::class, 'index']);
        Route::get('/timetable-slots', [TimetableSlotController::class, 'index']);

        Route::get('/meetings', [MeetingController::class, 'index']);
        Route::post('/meetings', [MeetingController::class, 'store']);
        Route::post('/meetings/parse-nlp', [MeetingController::class, 'parseNlp']);
        Route::post('/meetings/check-clash', [MeetingController::class, 'checkClash']);
        Route::get('/meetings/{meeting}', [MeetingController::class, 'show']);
        Route::put('/meetings/{meeting}', [MeetingController::class, 'update']);
        Route::delete('/meetings/{meeting}', [MeetingController::class, 'destroy']);

        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/users', [AdminUserController::class, 'index']);
            Route::post('/users', [AdminUserController::class, 'store']);
            Route::put('/users/{user}', [AdminUserController::class, 'update']);
            Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);

            Route::post('/exam-periods', [ExamPeriodController::class, 'store']);
            Route::put('/exam-periods/{examPeriod}', [ExamPeriodController::class, 'update']);
            Route::delete('/exam-periods/{examPeriod}', [ExamPeriodController::class, 'destroy']);

            Route::post('/timetable-slots', [TimetableSlotController::class, 'store']);
            Route::put('/timetable-slots/{timetableSlot}', [TimetableSlotController::class, 'update']);
            Route::delete('/timetable-slots/{timetableSlot}', [TimetableSlotController::class, 'destroy']);

            Route::get('/courses', [AdminCourseController::class, 'index']);
            Route::post('/courses', [AdminCourseController::class, 'store']);
            Route::get('/courses/{course}', [AdminCourseController::class, 'show']);
            Route::put('/courses/{course}', [AdminCourseController::class, 'update']);
            Route::delete('/courses/{course}', [AdminCourseController::class, 'destroy']);
            Route::post('/courses/{course}/users', [AdminCourseController::class, 'enrolUser']);
            Route::delete('/courses/{course}/users/{user}', [AdminCourseController::class, 'removeUser']);
            Route::post('/courses/{course}/exam-periods', [AdminCourseController::class, 'storeExamPeriod']);
            Route::put('/course-exam-periods/{courseExamPeriod}', [AdminCourseController::class, 'updateExamPeriod']);
            Route::delete('/course-exam-periods/{courseExamPeriod}', [AdminCourseController::class, 'destroyExamPeriod']);
        });
    });
});
