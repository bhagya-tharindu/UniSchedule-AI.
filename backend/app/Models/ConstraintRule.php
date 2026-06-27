<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConstraintRule extends Model
{
    protected $fillable = [
        'rule_type',
        'name',
        'valid_from',
        'valid_to',
        'metadata',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'valid_from' => 'date',
            'valid_to' => 'date',
            'metadata' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
