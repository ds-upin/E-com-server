const express = require("express");
const router = express.Router();

const {
    postPlaceOrder,
    getUserOrder,
    getSpecificOrder,
    putCancelOrder,
} = require("../controller/order.controller");

router.post("/",postPlaceOrder);
router.get("/",getUserOrder);
router.get("/:id",getSpecificOrder);
router.put("/:id/cancel",putCancelOrder);

module.exports = router;