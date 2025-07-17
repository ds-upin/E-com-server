const express = require("express");
const router = express.Router();

const {
    putUpdateUserProfile,
    deleteAnAccount,
    getLoggedIn,
    getUserById,
    getAllUser,
} = require("../controller/user.controller");

router.put("/me",putUpdateUserProfile);
router.delete("/me",deleteAnAccount);
router.get("/me",getLoggedIn);
router.get("/:id",getUserById); //admin
router.get("/",getAllUser); //admin

module.exports = router;