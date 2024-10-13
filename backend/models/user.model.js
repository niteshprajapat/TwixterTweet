import mongoose, { now } from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    coverImage: {
        type: String,
        default: ""
    },
    socialLink: {
        type: String,
        default: ""
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    joinedOn: {
        type: Date,
        default: Date.now
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiresAt: {
        type: Date,
    },

}, { timestamps: true });


const User = mongoose.model("User", userSchema);;
export default User;