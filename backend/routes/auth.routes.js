import express from 'express';
const router = express.Router();

import { register, login, logout, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import passport from 'passport';


router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/', // Adjust this redirect URL as needed
})
);

export default router;
