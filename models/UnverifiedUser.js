const mongoose = require('mongoose');

const unverifiedUserSchema = new mongoose.Schema({
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
    pincode: {
        type: Number,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    verificationCode: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600,
    }
});

const UnverifiedUser = mongoose.model('UnverifiedUser', unverifiedUserSchema);
module.exports = UnverifiedUser;