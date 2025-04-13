<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;



class Product extends Model
{ 
  

    protected $fillable = [
        'name', 'price', 'color_bg', 'stock', 'quantity_sold', 'section_id', 'image', 'unit'
    ];


    public function section()
    {
        return $this->belongsTo(Section::class);
    }
    public function salads()
    {
        return $this->belongsToMany(Salad::class)
                    ->withPivot('quantity') 
                    ->withTimestamps(); 
    }
    public function orders()
{
    return $this->belongsToMany(Order::class, 'order_product')
                ->withPivot('quantity')
                ->withTimestamps();
}

}
