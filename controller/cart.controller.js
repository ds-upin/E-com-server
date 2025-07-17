const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Middleware should set req.user._id
const getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart) return res.status(200).json({ items: [], total: 0 });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching cart." });
    }
};

const postAddItem = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [], total: 0 });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        cart.total = calculateTotal(cart.items, await Product.find({ _id: { $in: cart.items.map(i => i.product) } }));
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

const putItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) return res.status(404).json({ error: "Item not found in cart" });

        item.quantity = quantity;

        cart.total = calculateTotal(cart.items, await Product.find({ _id: { $in: cart.items.map(i => i.product) } }));
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to update item quantity" });
    }
};

const deleteItem = async (req, res) => {
    const { productId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        cart.total = calculateTotal(cart.items, await Product.find({ _id: { $in: cart.items.map(i => i.product) } }));
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete item" });
    }
};

const deleteClearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = [];
        cart.total = 0;
        await cart.save();

        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear cart" });
    }
};

module.exports = {getUserCart, postAddItem, putItemQuantity, deleteItem, deleteClearCart};