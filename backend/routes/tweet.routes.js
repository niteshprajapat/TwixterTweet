import express from 'express';
const router = express.Router();

import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { createTweet, deleteTweet, likeUnlikeTweet, updateTweet } from '../controllers/tweet.controller.js';


router.post("/createTweet", isAuthenticated, createTweet);
router.delete("/deleteTweet/:id", isAuthenticated, deleteTweet);
router.put("/updateTweet/:id", isAuthenticated, updateTweet);

router.get("/likeUnlikeTweet/:id", isAuthenticated, likeUnlikeTweet)


export default router;


