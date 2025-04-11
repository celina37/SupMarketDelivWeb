<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        // Log the incoming request data
        \Log::info($request->all());

        try {
            // Validate incoming request data
            $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric',
                'color_bg' => 'required|string',
                'stock' => 'required|integer',
                'quantity_sold' => 'nullable|integer',
                'section_id' => 'required|exists:sections,id',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
                'unit' => 'required|in:pcs,kg,g',
            ]);

            // Process image upload
            $imagePath = $request->file('image')->store('products', 'public');

            // Create product in the database
            $product = Product::create([
                'name' => $request->name,
                'price' => $request->price,
                'color_bg' => $request->color_bg,
                'stock' => $request->stock,
                'quantity_sold' => $request->quantity_sold,
                'section_id' => $request->section_id,
                'image' => $imagePath,
                'unit' => $request->unit,
            ]);

            return response()->json([
                'message' => 'Product created successfully!',
                'product' => $product,
            ]);

        } catch (\Exception $e) {
            // Log the exception error
            \Log::error("Error creating product: " . $e->getMessage());

            return response()->json([
                'message' => 'Error creating product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function index(Request $request)
    {
        // Check if section_id is provided in the request
        $sectionId = $request->query('section_id');
        
        if ($sectionId) {
            // Filter products by section_id
            $products = Product::where('section_id', $sectionId)->get();
        } else {
            // If no section_id, return all products
            $products = Product::all();
        }
    
        return response()->json($products);
    }
    
public function update(Request $request, $id)
{
    $product = Product::findOrFail($id);

    $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'unit' => 'required|string',
        'section_id' => 'required|integer',
        'image' => 'nullable|image|max:10240', // Optional image upload
    ]);

    $product->name = $request->name;
    $product->price = $request->price;
    $product->stock = $request->stock;
    $product->unit = $request->unit;
    $product->section_id = $request->section_id;

    if ($request->hasFile('image')) {
        // Delete old image
        if ($product->image) {
            Storage::delete('public/' . $product->image);
        }
        $path = $request->file('image')->store('public');
        $product->image = str_replace('public/', '', $path);
    }

    $product->save();

    return response()->json(['product' => $product]);
}

}
