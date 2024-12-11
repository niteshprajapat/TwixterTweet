import express from 'express';
const router = express.Router();

import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { bookmarkTweet, createTweet, deleteTweet, fetchAllTweets, fetchAllUsersRetweetsTweetsByTweetId, fetchRetweetedTweetsByUserId, fetchTweetByUserId, followingTweetsOnly, likedTweetByUserId, likeUnlikeTweet, retweetTweet, undoRetweetTweet, updateTweet } from '../controllers/tweet.controller.js';



router.get("/tweetsByUserId/:userId", isAuthenticated, fetchTweetByUserId);
router.get("/fetchAllTweets", isAuthenticated, fetchAllTweets);
router.post("/createTweet", isAuthenticated, createTweet);
router.delete("/deleteTweet/:id", isAuthenticated, deleteTweet);
router.put("/updateTweet/:id", isAuthenticated, updateTweet);
router.post("/likeUnlikeTweet/:id", isAuthenticated, likeUnlikeTweet);
router.get("/bookmark-tweet/:tweetId", isAuthenticated, bookmarkTweet);
router.get("/followingTweets", isAuthenticated, followingTweetsOnly);

router.get("/likedTweetByUserId/:userId", isAuthenticated, likedTweetByUserId)



// RE-Tweet Functionality

// retweet a tweet
router.get("/retweet/:tweetId", isAuthenticated, retweetTweet);

// retweet a tweet
router.get("/undo-retweet/:tweetId", isAuthenticated, undoRetweetTweet);

// get all tweets retweets by a userId
router.get("/retweets/user/:userId", isAuthenticated, fetchRetweetedTweetsByUserId);

// get all users retweeted a tweet by TweetId
router.get("/retweets/users/:tweetId", isAuthenticated, fetchAllUsersRetweetsTweetsByTweetId);

export default router;


