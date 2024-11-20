import express from 'express';
const router = express.Router();

import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { bookmarkTweet, createTweet, deleteTweet, likeUnlikeTweet, updateTweet } from '../controllers/tweet.controller.js';


router.post("/createTweet", isAuthenticated, createTweet);
router.delete("/deleteTweet/:id", isAuthenticated, deleteTweet);
router.put("/updateTweet/:id", isAuthenticated, updateTweet);

router.get("/likeUnlikeTweet/:id", isAuthenticated, likeUnlikeTweet);

router.get("/bookmark-tweet/:tweetId", isAuthenticated, bookmarkTweet);
export default router;


