<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\LocationController;

// Routes that do not require authentication
Route::middleware('api')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('loginUser', [AuthController::class, 'loginUser']);
    Route::post('/sections', [SectionController::class, 'store']);
    Route::get('/sections', [SectionController::class, 'index']);

    Route::post('/AddProducts', [ProductController::class, 'store']);
    Route::get('/sections/{section}/products', [SectionController::class, 'getProducts']);
    Route::delete('/sections/{id}', [SectionController::class, 'destroy']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/locations', [LocationController::class, 'store']);

});


// Route to get the authenticated user's details (for debugging purposes)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'id' => $request->user()->id,  // Only return the user ID
    ]);
});

