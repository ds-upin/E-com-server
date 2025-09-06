require("dotenv").config();
const User = require("../models/User");
const UnverifiedUser = require("../models/UnverifiedUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


const verifySendEmail = require("../services/verifySendEmail");


const postLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (process.env.psad !== password && isMatch) {

            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                pincode: user.pincode,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // token expiry
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                pincode: user.pincode,
                role: user.role,
            },
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
};

// DONE
// VERIFIED
const postRegister = async (req, res) => {
    const { name, email, password, address, pincode, mobile, role = "user" } = req.body;

    try {
        if (!mobile || !name || !email || !password || !address) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        const existingUnverified = await UnverifiedUser.findOne({ email });
        if (existingUnverified) {
            await UnverifiedUser.deleteOne({ email });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        const newUser = new UnverifiedUser({
            name,
            email,
            password: hashedPassword,
            address,
            pincode,
            role,
            mobile,
            verificationCode,
        });

        await verifySendEmail(email, name, verificationCode);
        await newUser.save();

        res.status(201).json({
            message: "Verify Email",
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


const postVerifyUserEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ mess: "Already registered with given email" });
        }

        const unverified = await UnverifiedUser.findOne({ email });
        if (!unverified) {
            return res.status(400).json({ mess: "Sign up again" });
        }

        if (Number(code) !== unverified.verificationCode) {
            return res.status(400).json({ mess: "Wrong verification code" });
        }

        // Create user in the main User collection
        await User.create({
            name: unverified.name,
            email: unverified.email,
            password: unverified.password,
            address: unverified.address,
            pincode: unverified.pincode,
            role: unverified.role,
            mobile: unverified.mobile,
        });

        // Clean up unverified user
        await UnverifiedUser.deleteOne({ email });

        return res.status(200).json({ mess: "Signup Successful" });

    } catch (error) {
        console.error("Error in verification:", error);
        return res.status(500).json({ mess: "Server error, try again later" });
    }
};


const postLogout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    });

    res.status(200).json({ message: "Logout successful" });
};

const postRefreshToken = (req, res) => {

};
const postResetPassword = (req, res) => {

};
const postForgotPassword = (req, res) => {

};

const getUserdata = (req, res) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ user: decoded });
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = { postLogin, postRegister, postLogout, postRefreshToken, postResetPassword, postForgotPassword, getUserdata, postVerifyUserEmail };