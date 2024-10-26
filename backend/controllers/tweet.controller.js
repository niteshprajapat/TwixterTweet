import Notification from "../models/notification.model.js";
import Tweet from "../models/tweet.model.js";
import User from "../models/user.model.js";

// createTweet
export const createTweet = async (req, res) => {
    try {
        const { tweetContent, tweetImage } = req.body;
        const userId = req.user._id;

        if (!tweetContent) {
            return res.status(404).json({
                success: false,
                message: "Tweet Content is Required!",
            });
        }

        const tweet = await Tweet.create({
            userId: userId,
            tweetContent,
            tweetImage,
        });

        return res.status(201).json({
            success: true,
            message: "Tweet Created Successfully!",
            tweet,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// deleteTweet
export const deleteTweet = async (req, res) => {
    try {
        const tweetId = req.params.id;
        const userId = req.user._id;

        if (!tweetId) {
            return res.status(404).json({
                success: false,
                message: "Tweet Not Found!",
            });
        }


        const tweet = await Tweet.findById(tweetId).populate({
            path: "userId",
            select: "-password",
        });

        if (userId?.toString() !== tweet?.userId?._id?.toString()) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized to delete this Tweet. You can only delete your own Tweet",
            });
        }

        await Tweet.findByIdAndDelete(tweetId);

        return res.status(200).json({
            success: true,
            message: "Tweet Deleted Successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// updateTweet
export const updateTweet = async (req, res) => {
    try {
        const tweetId = req.params.id;
        const userId = req.user._id;
        const { tweetContent, tweetImage } = req.body;

        if (!tweetId) {
            return res.status(404).json({
                success: false,
                message: "Tweet Not Found!",
            });
        }

        const tweet = await Tweet.findById(tweetId).populate({
            path: "userId",
            select: "-password",
        });

        if (userId?.toString() !== tweet?.userId?._id?.toString()) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized to update this Tweet. You can only update your own Tweet",
            });
        }

        await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set: {
                    tweetContent,
                    tweetImage,
                }
            },
            { new: true },
        );

        await tweet.save();


        return res.status(200).json({
            success: true,
            message: "Tweet Updated Successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// likeUnlikeTweet
export const likeUnlikeTweet = async (req, res) => {
    try {
        const tweetId = req.params.id;
        const userId = req.user._id;

        if (!tweetId) {
            return res.status(404).json({
                success: false,
                message: "Tweet Not Found!",
            });
        }

        const user = await User.findById(userId).select("-password");

        const tweet = await Tweet.findById(tweetId).populate({
            path: "userId",
            select: "-password",
        });

        if (tweet.likes.includes(userId)) {
            // Unlike
            await Tweet.findByIdAndUpdate(tweetId, { $pull: { likes: userId } }, { new: true });

            return res.status(200).json({
                success: true,
                message: `${user?.userName} unliked tweet!`,
            });

        } else {
            // like
            await Tweet.findByIdAndUpdate(tweetId, { $push: { likes: userId } }, { new: true });

            const notification = new Notification({
                from: userId,
                to: tweet?.userId?._id,
                type: "like"
            });

            // send notification Email here

            await notification.save();

            return res.status(200).json({
                success: true,
                message: `${user?.userName} liked tweet!`,
            });

        }





        return res.status(200).json({
            success: true,
            message: "Tweet Updated Successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}