<?php 

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    // Store method (already provided)
    public function store(Request $request)
    {
        // Validate the inputs
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', 
        ]);

        // Handle the image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            // Store the image in the 'public/images/section' directory
            $imagePath = $request->file('image')->store('images/section', 'public');
        }

        // Create the section record in the database
        $section = Section::create([
            'name' => $request->name,
            'image' => $imagePath ?? null,
        ]);

        return response()->json([
            'message' => 'Section created successfully!',
            'section' => $section
        ]);
    }

    // Fetch all sections
    public function index()
    {
        $sections = Section::all();  // Get all sections from the database
        return response()->json($sections);  // Return the sections as a JSON response
    }

    // Other methods...
}
