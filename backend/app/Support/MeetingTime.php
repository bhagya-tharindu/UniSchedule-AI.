<?php

namespace App\Support;

use Carbon\Carbon;

class MeetingTime
{
    /**
     * Parse API/datetime input respecting embedded offsets (e.g. ISO Z),
     * then normalize to the application timezone for storage and comparisons.
     */
    public static function parse(string $value): Carbon
    {
        return Carbon::parse($value)->timezone(config('app.timezone'));
    }
}
