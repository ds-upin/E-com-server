const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// DONE RECHECK

const postPlaceOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;
        //console.log(req.body)
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "No items in the order." });
        }

        let totalAmount = 0;
        const validatedItems = [];

        for (const item of items) {
            const { productId, quantity } = item;

            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({ message: "Each item must have a valid productId and quantity > 0." });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${productId}` });
            }

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
                });
            }

            // Decrement stock
            await Product.updateOne(
                { _id: productId },
                { $inc: { stock: -quantity } }
            );

            totalAmount += product.sellingPrice * quantity;

            validatedItems.push({
                product: productId,
                quantity,
                price: product.sellingPrice
            });
        }

        // Create order
        const newOrder = new Order({
            user: req.user.id,
            items: validatedItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
        });

        const savedOrder = await newOrder.save();

        // Remove ordered items from cart
        const orderedProductIds = validatedItems.map(item => item.product);
        await Cart.updateOne(
            { user: req.user.id },
            { $pull: { items: { product: { $in: orderedProductIds } } } }
        );

        // Recalculate cart total
        const cart = await Cart.findOne({ user: req.user.id });
        if (cart) {
            let newTotal = 0;
            for (const cartItem of cart.items) {
                const product = await Product.findById(cartItem.product);
                if (product) {
                    newTotal += product.sellingPrice * cartItem.quantity;
                }
            }
            cart.total = newTotal;
            await cart.save();
        }

        return res.status(201).json(savedOrder);

    } catch (error) {
        return res.status(500).json({ message: "Error placing order", error: error.message });
    }
};

// DONE
const getUserOrder = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate("items.product", "name price slug");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user orders", error: error.message });
    }
};

// DONE
const getSpecificOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.product", "name price");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Optional: Only allow users to view their own orders
        if (!order.user._id.equals(req.user.id)) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

// DONE
const putCancelOrder = async (req, res) => {
    //console.log("Cancel route hit")
    const { id } = req.params;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (["shipped", "delivered", "cancelled"].includes(order.status)) {
            return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}` });
        }
        for (const item of order.items) {
            console.log(`Restocking product ${item.product} with quantity: ${item.quantity}`);

            const updated = await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } }, //use stock here
                { new: true }
            );
        }
        order.status = "cancelled";
        await order.save();

        res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to cancel order", error });
    }
};

module.exports = { postPlaceOrder, getUserOrder, getSpecificOrder, putCancelOrder };