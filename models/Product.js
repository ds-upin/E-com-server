const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    costPrice: {
        type: Number,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        trim: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    image: [{
        url: String,
    }],
    rating: {
        type: Number,
        //default: true,
    },},
    { timestamps: true,
});

module.exports = mongoose.model('Product',productSchema);