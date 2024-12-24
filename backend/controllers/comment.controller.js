import Comment from "../models/comment.model.js";
import Tweet from "../models/tweet.model.js";



// createComment
export const createComment = async (req, res) => {
    try {
        const tweetId = req.params.tweetId;
        const userId = req.user._id;

        const { comment } = req.body;
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Please provide comment text!",
            });
        }

        const newComment = await Comment.create({
            comment,
            userId,
            tweetId,
        });

        const tweet = await Tweet.findById(tweetId).populate({
            path: "comments"
        });

        if (tweet) {
            tweet.comments.push(newComment._id);
            await tweet.save();
        }


        return res.status(200).json({
            success: true,
            message: "Comment Added!",
            comment: newComment,
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// deleteComment
export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment Not Found!",
            });
        }


        if (comment.userId.toString() !== userId?.toString()) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized to delete this comment!",
            });
        }

        await Comment.findByIdAndDelete(commentId);


        const tweet = await Tweet.findById(comment.tweetId);

        if (!tweet) {
            return res.status(400).json({
                success: false,
                message: "Tweet Not Found!",
            });
        }

        if (tweet) {
            tweet.comments = tweet.comments.filter((id) => id.toString() !== commentId.toString());
            await tweet.save();
        }

        return res.status(200).json({
            success: true,
            message: "Comment Deleted!",
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// updateComment
export const updateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { comment } = req.body;

        const existingComment = await Comment.findById(commentId);
        if (!existingComment) {
            return res.status(400).json({
                success: false,
                message: "Comment Not Found!",
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(commentId, { $set: { comment } }, { new: true });


        return res.status(200).json({
            success: true,
            message: "Comment Updated!",
            comment: updateComment,
        });




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// commentLikeUnlike
export const commentLikeUnlike = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment Not Found!",
            });
        }

        if (comment.commentLikes.includes(userId)) {
            // unlike comment
            await Comment.findByIdAndUpdate(commentId, { $pull: { commentLikes: userId } }, { new: true });

            return res.status(200).json({
                success: true,
                message: "Comment Unliked!",
            });
        } else {
            // like comment
            await Comment.findByIdAndUpdate(commentId, { $push: { commentLikes: userId } }, { new: true });

            return res.status(200).json({
                success: true,
                message: "Comment liked!",
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

// fetchCommentsByTweetId
export const fetchCommentsByTweetId = async (req, res) => {
    try {
        const tweetId = req.params.tweetId;
        const userId = req.user._id;

        const comments = await Comment.find({ tweetId }).populate({
            path: "userId",
            select: "avatar userName fullName"
        });

        if (!comments) {
            return res.status(400).json({
                success: false,
                message: "Comments Not Found!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Comments Fetched by TweetId!",
            comments
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}