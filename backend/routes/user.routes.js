import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { followUnfollowByID, getProfileById, meProfile, getSuggestedUsers } from '../controllers/user.controller.js';


router.get("/me", isAuthenticated, meProfile);
router.get("/profile/:userId", isAuthenticated, getProfileById);

router.get("/followUnfollow/:id", isAuthenticated, followUnfollowByID);
router.get("/suggestedUsers", isAuthenticated, getSuggestedUsers);


export default router;
