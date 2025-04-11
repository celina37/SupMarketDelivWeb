<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;

// Auth routes
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login'); 

// Root route
Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Protected Dashboard
Route::get('/dashboard', function () {
    \Log::info('Accessing dashboard', ['user_id' => optional(Auth::user())->id]);

    if (Auth::guard('web')->check() && Auth::id() !== 1) {
        Auth::logout();
        abort(403, 'Unauthorized');
    }

    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Logout route
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

// API auth routes
Route::prefix('api')->group(function() {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('loginUser', [AuthController::class, 'loginUser']);
});

// Include other auth-related routes
require __DIR__.'/auth.php';
