import express from "express";
import User from "../models/User2.js";

const router = express.Router();


router.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = user.generateAuthToken();
        res.cookie("token", token, { httpOnly: true }); 
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        next(err);
    }
});


router.post("/signup", async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        next(err);
    }
});

export default router;
