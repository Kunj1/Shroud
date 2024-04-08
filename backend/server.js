import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {authRoutes} from "./routes/auth.js";
import {userRoutes} from "./routes/users.js";
import {locationRoutes} from "./routes/location.js";
import {faceVerifyRoutes} from "./routes/faceVerify.js";

const app = express();
dotenv.config();

app.use(cookieParser());
app.use(express.json());

const connect = () => {
    mongoose
        .connect(process.env.MONGO)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            throw err;
        });
};

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/face-verification", faceVerifyRoutes);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
});
