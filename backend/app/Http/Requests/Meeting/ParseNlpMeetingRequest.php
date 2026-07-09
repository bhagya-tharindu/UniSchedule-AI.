<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;

class ParseNlpMeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'text' => ['required', 'string', 'min:3', 'max:2000'],
            'meeting_mode' => ['sometimes', 'nullable', 'in:jitsi,external'],
        ];
    }
}
