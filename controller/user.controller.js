const User = require("../models/User");

//DONE VALIDATE USER
const putUpdateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, address, pincode, mobile } = req.body;

        if (!name || !address || !pincode) {
            return res.status(400).json({ error: "Name, address, and pincode are required." });
        }

        const updateFields = { name, address, pincode };
        if (mobile?.trim()) updateFields.mobile = mobile;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Server Error" });
    }
};




// DONE USER
const deleteAnAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE VALIDATE USER
const getLoggedIn = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//DONE ADMIN
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//DONE  ADMIN
const getAllUser = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { putUpdateUserProfile, deleteAnAccount, getLoggedIn, getUserById, getAllUser };