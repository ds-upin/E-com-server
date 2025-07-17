const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
    },
    password: { 
        type: String, 
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    pincode:{
        type: Number,
    },
    role: { 
        type: String,
        enum: ['user', 'admin'],
        default: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
