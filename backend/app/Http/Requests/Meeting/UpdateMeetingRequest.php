<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_time' => ['sometimes', 'date'],
            'end_time' => ['sometimes', 'date', 'after:start_time'],
            'room_id' => ['nullable', 'exists:rooms,id'],
            'participant_ids' => ['sometimes', 'array'],
            'participant_ids.*' => ['exists:users,id'],
            'force' => ['sometimes', 'boolean'],
        ];
    }
}
