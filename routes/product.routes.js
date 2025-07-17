const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
    getAllProduct,
    getProductDetails,
    postCreateProduct,
    putUpdateProduct,
    deleteProduct,
} = require("../controller/product.controller");

router.get("/",getAllProduct);
router.get("/:id",getProductDetails);
router.post("/",upload.single("image"),postCreateProduct);
router.put("/:id",putUpdateProduct);
router.delete("/:id",deleteProduct);

module.exports = router;