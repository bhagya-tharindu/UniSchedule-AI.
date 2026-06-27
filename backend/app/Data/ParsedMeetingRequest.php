<?php

namespace App\Data;

/**
 * Structured output from NLP parsing — not persisted until validated by SchedulingService.
 */
final class ParsedMeetingRequest
{
    /**
     * @param  array<int>  $participantIds
     * @param  array<string>  $participantNames
     * @param  array<string>  $validationErrors
     */
    public function __construct(
        public readonly string $intent,
        public readonly ?string $title,
        public readonly ?string $description,
        public readonly ?string $startTime,
        public readonly ?string $endTime,
        public readonly array $participantIds,
        public readonly array $participantNames,
        public readonly ?int $roomId,
        public readonly ?string $roomName,
        public readonly float $confidence,
        public readonly string $parser,
        public readonly string $rawText,
        public readonly array $validationErrors = [],
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'intent' => $this->intent,
            'title' => $this->title,
            'description' => $this->description,
            'start_time' => $this->startTime,
            'end_time' => $this->endTime,
            'participant_ids' => $this->participantIds,
            'participant_names' => $this->participantNames,
            'room_id' => $this->roomId,
            'room_name' => $this->roomName,
            'confidence' => $this->confidence,
            'parser' => $this->parser,
            'raw_text' => $this->rawText,
            'validation_errors' => $this->validationErrors,
        ];
    }
}
