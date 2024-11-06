import mongoose, { now } from "mongoose";

const tweetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tweetContent: {
        type: String,
        required: true,
    },
    tweetImage: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        },
    ],
    retweet: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: []
        }
    ],


}, { timestamps: true });


const Tweet = mongoose.model("Tweet", tweetSchema);;
export default Tweet;