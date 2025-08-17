const express = require("express");
const router = express.Router();

const {
    getAllOrders,
    putUpdateOrderStatus,
    getOrderByStatus,
    getAdminAllProduct,
} = require("../controller/adminPanel.controller");

router.get("/orders",getAllOrders);
router.put("/orders/:id",putUpdateOrderStatus);
router.get("/orders/:id",getOrderByStatus);
router.get("/products",getAdminAllProduct);

module.exports = router;