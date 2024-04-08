import express from "express";
import User2 from "../models/User2.js";

const userRoutes = express.Router();

userRoutes.get("/:username", async (req, res, next) => {
    const username = req.params.username;
    try {
        const user = await User2.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { _id, username, email } = user;
        res.status(200).json({ _id, username, email });
    } catch (err) {
        next(err);
    }
});

export {userRoutes};