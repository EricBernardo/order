<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'client_id',
        'subtotal',
        'discount',
        'total',
        'paid',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

}
