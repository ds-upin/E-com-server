const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    postLogin,
    postRegister,
    postLogout,
    postRefreshToken,
    postResetPassword,
    postForgotPassword,
    getUserdata,
    postVerifyUserEmail,
} = require("../controller/auth.controller");

router.post("/register", postRegister);
router.post("/login", postLogin);
router.post("/logout", postLogout);
router.post("/refresh-token", postRefreshToken);
router.post("/forgot-password", postForgotPassword);
router.post("/reset-password", postResetPassword);
router.post("/verify-email", postVerifyUserEmail);
router.get("/me", authMiddleware, getUserdata);

module.exports = router;