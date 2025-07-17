const express = require("express");
const router = express.Router();

const {
    postLogin,
    postRegister,
    postLogout,
    postRefreshToken,
    postResetPassword,
    postForgotPassword,
    getUserdata,
} = require("../controller/auth.controller");

router.post("/register",postRegister);
router.post("/login",postLogin);
router.post("/logout",postLogout);
router.post("/refresh-token",postRefreshToken);
router.post("/forgot-password",postForgotPassword);
router.post("/reset-password",postResetPassword);
router.get("/me",getUserdata);

module.exports = router;