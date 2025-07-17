const express = require("express");
const router = express.Router();

const {
    getAllOrders,
    putUpdateOrderStatus,
    getOrderByStatus,
} = require("../controller/adminPanel.controller");

router.get("orders",getAllOrders);
router.put("orders/:id",putUpdateOrderStatus);
router.get("orders/:id",getOrderByStatus);

module.exports = router;