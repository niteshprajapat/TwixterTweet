import express from 'express';
const router = express.Router();

import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { bookmarkTweet, createTweet, deleteTweet, fetchAllTweets, followingTweetsOnly, likedTweetByUserId, likeUnlikeTweet, retweetTweet, updateTweet } from '../controllers/tweet.controller.js';



router.get("/fetchAllTweets", isAuthenticated, fetchAllTweets);
router.post("/createTweet", isAuthenticated, createTweet);
router.delete("/deleteTweet/:id", isAuthenticated, deleteTweet);
router.put("/updateTweet/:id", isAuthenticated, updateTweet);
router.get("/likeUnlikeTweet/:id", isAuthenticated, likeUnlikeTweet);
router.get("/bookmark-tweet/:tweetId", isAuthenticated, bookmarkTweet);
router.get("/followingTweets", isAuthenticated, followingTweetsOnly);

router.get("/likedTweetByUserId/:userId", isAuthenticated, likedTweetByUserId)



// RE-Tweet Functionality

// retweet a tweet
router.post("/retweet/:tweetId", isAuthenticated, retweetTweet);

export default router;


