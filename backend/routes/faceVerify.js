import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { execSync } from "child_process";
import fs from "fs";
import User2 from "../models/User2.js";

const faceVerifyRoutes = express.Router();

faceVerifyRoutes.use(cookieParser());
faceVerifyRoutes.use(fileUpload());

faceVerifyRoutes.post('/verify-face', async (req, res) => {
    try {
        const { userId } = req.cookies;

        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const user = await User2.findById(userId);

        if (!user || !user.img) {
            return res.status(404).json({ error: 'User image not found' });
        }

        const uploadedImage = req.files.image;
        const tempFilePath = './temp/image.jpg';
        await uploadedImage.mv(tempFilePath);

        const pythonScriptPath = 'face.py';
        const result = execSync(`python ${pythonScriptPath} ${user.img} ${tempFilePath}`).toString().trim();

        if (result === 'True') {
            res.status(200).json({ message: 'Face identified' });
        } else {
            res.status(403).json({ error: 'Face not identified' });
        }

        fs.unlinkSync(tempFilePath);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export {faceVerifyRoutes};