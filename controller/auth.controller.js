require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


const postLogin = (req, res) => {

};

// DONE
// VERIFIED
const postRegister = async (req, res) => {
    const { name, email, password, address, pincode, role } = req.body;

    try {
        if (!name || !email || !password || !address) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            address,
            pincode,
            role 
        });

        await newUser.save();
        res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
        });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
};

const postLogout = (req, res) => {

};
const postRefreshToken = (req, res) => {

};
const postResetPassword = (req, res) => {

};
const postForgotPassword = (req, res) => {

};
const getUserdata = (req, res) => {

};

module.exports = {postLogin, postRegister, postLogout, postRefreshToken, postResetPassword, postForgotPassword, getUserdata};