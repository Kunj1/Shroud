import express from "express";
const User = require("../models/User2.js");

const router = express.Router();

router.get("/:username", async (req, res, next) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { _id, username, email } = user;
        res.status(200).json({ _id, username, email });
    } catch (err) {
        next(err);
    }
});

export default router;
