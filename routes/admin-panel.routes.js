const express = require("express");
const authAdmin = require("../middleware/authAdmin")
const router = express.Router();

const {
    getAllOrders,
    patchUpdateOrderStatus,
    getOrderByStatus,
    getAdminAllProduct,
} = require("../controller/adminPanel.controller");

router.get("/orders",authAdmin,getAllOrders);
router.patch("/orders/:id",authAdmin,patchUpdateOrderStatus);
router.get("/orders/:status",authAdmin,getOrderByStatus);
router.get("/products",authAdmin,getAdminAllProduct);

module.exports = router;