const Order = require("../models/Order");

// DONE RECHECK
const postPlaceOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in the order." });
        }

        const newOrder = new Order({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};

// DONE
const getUserOrder = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.product", "name price");
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
        if (!order.user._id.equals(req.user._id)) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

// DONE
const putCancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}` });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order", error });
  }
};

module.exports = {postPlaceOrder, getUserOrder, getSpecificOrder, putCancelOrder};