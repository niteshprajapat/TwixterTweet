import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { followUnfollowByID, getProfileById, meProfile, getSuggestedUsers, searchAccount, deleteAccount, followingList, followersList, updateProfile } from '../controllers/user.controller.js';
import { uploadMedia } from '../utils/imageUploadFile.js';


// Upload Image API
router.post('/uploadFile', uploadMedia)



router.get("/me", isAuthenticated, meProfile);
router.get("/profile/:userId", isAuthenticated, getProfileById);

router.get("/followUnfollow/:id", isAuthenticated, followUnfollowByID);
router.get("/suggestedUsers", isAuthenticated, getSuggestedUsers);

router.get('/search', isAuthenticated, searchAccount);


router.get("/followingList/:id", isAuthenticated, followingList)
router.get("/followersList/:id", isAuthenticated, followersList)
router.delete('/deleteAccount', isAuthenticated, deleteAccount);

// Update User - Pending
router.put("/updateProfile", isAuthenticated, updateProfile);



export default router;
