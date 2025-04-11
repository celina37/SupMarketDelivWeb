<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminOnly
{
    public function handle(Request $request, Closure $next)
    {
        // Ensure user is logged in
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Allow only the admin with ID = 1
        if (Auth::user()->id !== 1) {
            Auth::logout();
            return abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
