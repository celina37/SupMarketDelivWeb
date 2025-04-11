<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class AuthController extends Controller
{
    
    public function register(Request $request)
    {
        // Validate incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|digits:8|unique:users,phone_number',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number, 
            'password' => Hash::make($request->password),
        ]);

        // Log the registration details without the token
        \Log::info('User registered successfully:', [
            'user' => $user
        ]);

        return response()->json([
            'message' => 'User registered successfully', 
            'user' => $user,
        ], 201);
    }

    public function loginUser(Request $request)
    {
        // Validate the request data
        \Log::info('Login attempt:', ['request_data' => $request->all()]);
    
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);
    
        if ($validator->fails()) {
            \Log::error('Validation failed for login:', ['errors' => $validator->errors()]);
            return response()->json($validator->errors(), 422);
        }
    
        // Attempt to find the user and verify password
        $user = User::where('email', $request->email)->first();
    
        if (!$user) {
            \Log::error('User not found for login attempt:', ['email' => $request->email]);
            return response()->json(['message' => 'Invalid email or password'], 401);
        }
    
        if (!Hash::check($request->password, $user->password)) {
            \Log::error('Password mismatch for login attempt:', ['email' => $request->email]);
            return response()->json(['message' => 'Invalid email or password'], 401);
        }
    
        // Log the successful login without the token
        \Log::info('Login successful:', [
            'user_id' => $user->id
        ]);
    
        // Generate a token using Sanctum (this part remains)
        $token = $user->createToken('flutter-app-token')->plainTextToken;
    
        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token // Send token back to the frontend
        ], 200);
    }
    
    
}
