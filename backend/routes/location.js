import express from "express";
import cookieParser from "cookie-parser";
import { getUserLocation } from "./userUtils.js";

const locationRoutes = express.Router();

locationRoutes.use(cookieParser());

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

locationRoutes.post('/verify-location', async (req, res) => {
    try {
        const { userId } = req.cookies;

        const userLocation = await getUserLocation(userId);

        const { latitude, longitude } = userLocation;

        const { reqLatitude, reqLongitude } = req.cookies;

        const distance = calculateDistance(latitude, longitude, reqLatitude, reqLongitude);

        const isLocationValid = distance <= 1;

        if (isLocationValid) {
            res.status(200).json({ message: 'Location verified successfully' });
        } else {
            res.status(403).json({ error: 'Location verification failed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export {locationRoutes};