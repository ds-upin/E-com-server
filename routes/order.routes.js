const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const {
    postPlaceOrder,
    getUserOrder,
    getSpecificOrder,
    putCancelOrder,
} = require("../controller/order.controller");

router.post("/",authMiddleware,postPlaceOrder);
router.get("/",authMiddleware,getUserOrder);
router.get("/:id",getSpecificOrder);
router.put("/:id",authMiddleware,putCancelOrder);

module.exports = router;