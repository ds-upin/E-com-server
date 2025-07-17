const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    items: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],
    totalAmount: { 
        type: Number 
    },
    status: { 
        type: String, 
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    shippingAddress: { 
        type: String, 
        required: true,
        trim: true,
    },
    paymentMethod: { 
        type: String 
    },
    paymentStatus: {
        type: String, 
        enum: ['pending', 'paid'], 
        default: 'pending' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
