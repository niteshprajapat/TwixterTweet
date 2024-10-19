import express from 'express';
const router = express.Router();

import { register, login, logout, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';


router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Google OAuth

export default router;
