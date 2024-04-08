import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null 
    }
});
//module.exports= mongoose.model('User',UserSchema);
export default mongoose.model("User2", UserSchema);