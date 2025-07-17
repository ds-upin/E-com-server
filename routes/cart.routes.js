const express = require('express');
const router = express.Router();

const {
    getUserCart,
    postAddItem,
    putItemQuantity,
    deleteItem,
    deleteClearCart,
} = require("../controller/cart.controller");
const { get } = require('mongoose');

router.get("/",getUserCart);
router.post("/",postAddItem);
router.put("/",putItemQuantity);
router.delete("/:productId",deleteItem);
router.delete("/",deleteClearCart);

module.exports = router;