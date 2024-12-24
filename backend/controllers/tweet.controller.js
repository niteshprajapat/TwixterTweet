import Notification from "../models/notification.model.js";
import Tweet from "../models/tweet.model.js";
import User from "../models/user.model.js";

// fetchTweetByUserId
export const fetchTweetByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        const tweets = await Tweet.find({ userId: userId }).sort({ createdAt: -1 }).populate({
            path: "userId",
            select: "avatar userName fullName",
        });


        return res.status(201).json({
            success: true,
            message: "Fetched All Tweets Successfully!",
            tweets,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// fetchTweetById
export const fetchTweetById = async (req, res) => {
    try {
        const tweetId = req.params.tweetId;

        const tweet = await Tweet.findById(tweetId).populate({
            path: "userId",
            select: "avatar userName fullName"
        });


        return res.status(201).json({
            success: true,
            message: "Fetched  Tweet By tweetId!",
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

// fetchAllTweets
export const fetchAllTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find({}).sort({ createdAt: -1 }).populate({
            path: "userId",
            select: "avatar userName fullName",
        });

        return res.status(201).json({
            success: true,
            message: "Fetched All Tweets Successfully!",
            tweets,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

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


// bookmarkTweet
export const bookmarkTweet = async (req, res) => {
    try {
        const tweetId = req.params.tweetId;
        const userId = req.user._id;

        if (!tweetId) {
            return res.status(404).json({
                success: false,
                message: "Tweet Not Found!",
            });
        }

        const user = await User.findById(userId);

        if (user.bookmarkedTweet.includes(tweetId)) {
            // remove from bookmark
            await User.findByIdAndUpdate(userId, { $pull: { bookmarkedTweet: tweetId } }, { new: true });

            return res.status(200).json({
                success: true,
                message: "Tweet removed Bookmarked! ",
            });

        } else {
            // add to bookmark
            await User.findByIdAndUpdate(userId, { $push: { bookmarkedTweet: tweetId } }, { new: true });
            return res.status(200).json({
                success: true,
                message: "Tweet Bookmarked Successfully!",
            });
        }





        return res.status(200).json({
            success: true,
            message: "Tweet Bookmarked Successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// getAllBookmarkTweets
export const getAllBookmarkTweets = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!",
            });
        }

        const bookmarks = await User.findById(userId).populate({
            path: "bookmarkedTweet",
            populate: {
                path: "userId",
                select: "-password"
            },
            select: "-password",
        });



        return res.status(200).json({
            success: true,
            message: "Fetched All Bookmarked! ",
            bookmarks,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// followingTweetsOnly
export const followingTweetsOnly = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("following");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            });
        }

        const tweets = await Tweet.find({
            userId: { $in: user.following }
        }).populate({
            path: "userId",
            select: "-password",
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Fetched all Tweets of following users",
            tweets,
        });





    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// likedPostByUserId
export const likedTweetByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        const likedPosts = await Tweet.find({ likes: { $in: userId } }).sort({ createdAt: -1 }).populate({
            path: "userId",
            select: "avatar userName fullName",
        });
        // const likedPosts = await Tweet.find();
        console.log("likedPosts", likedPosts);

        return res.status(200).json({
            success: true,
            message: "Fetched all Tweets liked by loggedIn User!",
            likedPosts,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// RE-Tweet Functionality

// retweetTweet
export const retweetTweet = async (req, res) => {
    try {
        const tweetId = req.params.tweetId;
        const userId = req.user._id;

        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(400).json({
                success: false,
                message: "Tweet Not Found!",
            });
        }

        if (tweet.retweet.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "Already Retweeted!"
            });
        }

        tweet.retweet.push(userId);
        await tweet.save();

        return res.status(201).json({
            success: true,
            message: "Tweet Retweeted Successfully!",
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

// undoRetweetTweet
export const undoRetweetTweet = async (req, res) => {
    try {
        const tweetId = req.params.tweetId;
        const userId = req.user._id;

        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(400).json({
                success: false,
                message: "Tweet Not Found!",
            });
        }

        if (tweet.retweet.includes(userId)) {
            // undo retweet
            await Tweet.findByIdAndUpdate(tweetId, { $pull: { retweet: userId } }, { new: true });

            return res.status(201).json({
                success: true,
                message: "Undo Retweeted a tweet Successfully!",
            });

        }




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// fetchRetweetedTweetsByUserId
export const fetchRetweetedTweetsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        const retweets = await Tweet.find({ retweet: { $in: userId } });
        // const retweets = await Tweet.find({ retweet: userId });

        return res.status(200).json({
            success: true,
            message: "Fetched All Retweets of a User!",
            retweets,
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// fetchAllUsersRetweetsTweetsByTweetId
export const fetchAllUsersRetweetsTweetsByTweetId = async (req, res) => {
    try {
        const tweetId = req.params.tweetId;

        const tweets = await Tweet.findById(tweetId).populate({
            path: "retweet",
            select: "-password"
        });

        return res.status(200).json({
            success: true,
            message: "Fetched All Users that Retweets a tweet",
            tweets,
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

