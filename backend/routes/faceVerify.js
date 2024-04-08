const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { execSync } = require('child_process');
const fs = require('fs');
const User = require('../models/User2.js');

const router = express.Router();

router.use(cookieParser());
router.use(fileUpload());

router.post('/verify-face', async (req, res) => {
    try {
        const { userId } = req.cookies;

        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const user = await User.findById(userId);

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

module.exports = router;