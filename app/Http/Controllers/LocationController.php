<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class LocationController extends Controller
{
    public function store(Request $request)
    {
      
        // Validate the incoming data
        $request->validate([
            'street_name' => 'required|string|max:255',
            'house_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'user_id' => 'required|integer', // Ensure user_id is passed
        ]);

        // Retrieve user_id from request
        $userIdFromRequest = $request->user_id;

        // Find the user by the user_id
        $user = User::find($userIdFromRequest);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Create and store the location, associating it with the user_id
        $location = Location::create([
            'street_name' => $request->street_name,
            'house_name' => $request->house_name,
            'phone_number' => $request->phone_number,
            'user_id' => $user->id, // Associate location with the user
        ]);

        return response()->json(['message' => 'Location created successfully', 'location' => $location], 201);
    }
}
