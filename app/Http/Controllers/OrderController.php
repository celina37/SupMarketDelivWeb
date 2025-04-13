<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'location_id' => 'required|exists:locations,id',
            'total_price' => 'required|numeric',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $request->user_id,
                'location_id' => $request->location_id,
                'total_price' => $request->total_price,
                'status' => 'pending',
            ]);

            foreach ($request->products as $product) {
                $order->products()->attach($product['product_id'], [
                    'quantity' => $product['quantity'],
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Order placed successfully', 'order_id' => $order->id], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Order failed', 'details' => $e->getMessage()], 500);
        }
    }
}
