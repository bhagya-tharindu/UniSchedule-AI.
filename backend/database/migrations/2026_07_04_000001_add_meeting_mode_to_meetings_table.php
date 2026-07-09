<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->string('meeting_mode', 20)->default('jitsi')->after('status');
            $table->string('meeting_url', 500)->nullable()->after('meeting_mode');
        });
    }

    public function down(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->dropColumn(['meeting_mode', 'meeting_url']);
        });
    }
};
