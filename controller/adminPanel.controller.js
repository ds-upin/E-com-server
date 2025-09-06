const Order = require("../models/Order");
const Product = require("../models/Product");
// for admin pannel
//DONE
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: "pending" }).populate("user", "name _id pincode");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

//DONE
const patchUpdateOrderStatus = async (req, res) => {
    const { id } = req.params;
    //console.log(req.body);
    const { status } = req.body;
    //console.log(status);

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
};

//DONE
const getOrderByStatus = async (req, res) => {
    const { status } = req.params;
    //console.log("Status",status);
    try {
        const orders = await Order.find({ status }).populate("user", "name _id pincode");
        //console.log(orders);
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ "error": "Error in fetching the data" });
    }
}

const getAdminAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAdminAllProduct, getAllOrders, patchUpdateOrderStatus, getOrderByStatus };