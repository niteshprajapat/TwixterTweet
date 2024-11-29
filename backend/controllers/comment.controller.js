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
        const userId = req.user_id;

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