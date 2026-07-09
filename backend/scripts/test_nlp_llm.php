<?php

use App\Models\User;
use App\Services\NlpSchedulingService;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$user = User::where('email', 'student@unischedule.test')->first();
if (! $user) {
    fwrite(STDERR, "NO_USER — run: php artisan db:seed\n");
    exit(1);
}

echo 'key_configured='.(config('services.openai.api_key') ? 'yes' : 'no').PHP_EOL;
echo 'base_url='.config('services.openai.base_url').PHP_EOL;
echo 'model='.config('services.openai.model').PHP_EOL;

$service = $app->make(NlpSchedulingService::class);
$result = $service->parse(
    'Book a supervision with Dr Jane Lecturer next Tuesday at 2pm online',
    $user,
    'jitsi',
);

echo 'parser='.$result->parser.PHP_EOL;
echo 'title='.($result->title ?? 'null').PHP_EOL;
echo 'start='.($result->startTime ?? 'null').PHP_EOL;
echo 'participants='.implode(',', $result->participantNames).PHP_EOL;
echo 'room_id='.($result->roomId ?? 'null').PHP_EOL;
