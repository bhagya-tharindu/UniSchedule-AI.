<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MeetingController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::get('/meetings', [MeetingController::class, 'index']);
        Route::post('/meetings', [MeetingController::class, 'store']);
        Route::post('/meetings/parse-nlp', [MeetingController::class, 'parseNlp']);
        Route::post('/meetings/check-clash', [MeetingController::class, 'checkClash']);
        Route::get('/meetings/{meeting}', [MeetingController::class, 'show']);
        Route::put('/meetings/{meeting}', [MeetingController::class, 'update']);
        Route::delete('/meetings/{meeting}', [MeetingController::class, 'destroy']);
    });
});
