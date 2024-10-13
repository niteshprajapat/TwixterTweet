import mongoose, { now } from "mongoose";

const tweetSchema = new mongoose.Schema({
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
        },
    ],
    retweet: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

}, { timestamps: true });


const Tweet = mongoose.model("Tweet", tweetSchema);;
export default Tweet;