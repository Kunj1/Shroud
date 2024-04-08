const User = require("../models/User2.js");

async function getUserLocation(userId) {
    try {
        const user = await User.findById(userId).select('latitude longitude');
        return user;
    } catch (error) {
        console.error('Error retrieving user location:', error);
        throw error;
    }
}

module.exports = { getUserLocation };