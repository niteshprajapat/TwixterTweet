import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { getProfileById, meProfile } from '../controllers/user.controller.js';


router.get("/me", isAuthenticated, meProfile);
router.get("/profile/:userId", isAuthenticated, getProfileById);


export default router;
