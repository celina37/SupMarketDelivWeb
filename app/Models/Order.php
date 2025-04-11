<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable=[
        'location_id',
        'user_id',
        'total_price',
       'status',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

  
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
