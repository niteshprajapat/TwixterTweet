import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { commentLikeUnlike, createComment, deleteComment, updateComment } from '../controllers/comment.controller.js';


router.post('/createComment/:tweetId', isAuthenticated, createComment);
router.put('/updateComment/:commentId', isAuthenticated, updateComment);
router.delete('/deleteComment/:commentId', isAuthenticated, deleteComment);
router.get('/commentLikeUnlike/:commentId', isAuthenticated, commentLikeUnlike);



export default router;
