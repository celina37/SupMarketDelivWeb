<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class ResetUserTokens extends Command
{
    protected $signature = 'tokens:reset';

    protected $description = 'Reset all user tokens on server restart';

    public function handle()
    {
        // Revoke all tokens for all users
        User::all()->each(function ($user) {
            $user->tokens->each(function ($token) {
                $token->delete(); // Delete the token
            });
        });

        $this->info('All user tokens have been reset.');
    }
}

