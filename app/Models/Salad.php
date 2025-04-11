<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salad extends Model
{
    protected $fillable = ['name', 'image'];


public function products()
    {
        return $this->belongsToMany(Product::class)
                    ->withPivot('quantity') 
                    ->withTimestamps();  
    }
}