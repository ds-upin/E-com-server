const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    getUserCart,
    postAddItem,
    patchItemQuantity,
    deleteItem,
    deleteClearCart,
} = require("../controller/cart.controller");
const { get } = require('mongoose');

router.get("/",authMiddleware,getUserCart);
router.post("/",authMiddleware, postAddItem);
router.patch("/",authMiddleware, patchItemQuantity);
router.delete("/:productId",authMiddleware, deleteItem);
router.delete("/",authMiddleware, deleteClearCart);

module.exports = router;