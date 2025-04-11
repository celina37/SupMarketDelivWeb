<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    // Show the login form
    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    // Handle the authentication process (Session-based for web only)
    public function store(LoginRequest $request)
    {
        \Log::info('Admin login attempt:', ['email' => $request->email]);

        // Authenticate the user using session
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            \Log::info('Authenticated user:', ['user_id' => $user->id]);

            // Regenerate session to prevent session fixation attacks
            $request->session()->regenerate();

            \Log::info('Admin logged in successfully', ['user_id' => $user->id]);

            // Log authenticated session
            if (Auth::check()) {
                \Log::info('User authenticated with session', ['user_id' => Auth::id()]);
            }

            // Redirect to dashboard
            return redirect()->intended(route('dashboard'));
        }

        // If authentication fails
        \Log::warning('Login failed for:', ['email' => $request->email]);

        return redirect()->back()->withErrors([
            'email' => 'Invalid credentials.',
        ]);
    }

    // Logout the user
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
