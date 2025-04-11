<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class Section extends Model
{    

    protected $fillable = ['name', 'image'];

public function products()
{
    return $this->hasMany(Product::class);
}
}