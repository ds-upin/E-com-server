const Order = require("../models/Order");
// for admin pannel
//DONE
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

//DONE
const putUpdateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
};

//DONE
const getOrderByStatus = async (req, res) => {
    const {status} = req.params;
    try{
        const orders = await Order.find({status: status});
        res.status(200).json(orders);
    }
    catch(error){
        res.status(500).json({"error":"Error in fetching the data"});
    }
}


module.exports = { getAllOrders, putUpdateOrderStatus, getOrderByStatus };