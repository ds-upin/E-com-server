const express = require("express");
const authAdmin = require("../middleware/authAdmin")
const router = express.Router();
const upload = require("../middleware/upload");

const {
    getAllProduct,
    getProductDetails,
    postCreateProduct,
    putUpdateProduct,
    deleteProduct,
} = require("../controller/product.controller");

router.get("/", getAllProduct);
router.get("/:id", getProductDetails);
router.post("/", authAdmin, upload.single("image"), postCreateProduct);
router.put("/:id", authAdmin, putUpdateProduct);
router.delete("/:id", authAdmin, deleteProduct);

module.exports = router;