import express from 'express';
const router = express.Router();

import { register, login, logout, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';


router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] })
);

// router.get('/auth/google/callback', passport.authenticate('google', {
//     failureRedirect: '/login',
//     successRedirect: '/', // Adjust this redirect URL as needed
// }));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
}), (req, res) => {
    try {
        // Redirect to the frontend with the JWT token as a query parameter or via a secure cookie
        const frontendURL = process.env.FRONTEND_URL;

        const user = req.user;

        // token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.cookie("twixter", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "strict",
        }).

            // const token = req.user.generateAuthToken(); // Example token generation
            // res.redirect(`${frontendURL}?token=${token}`);
            res.redirect(`/`);
    } catch (error) {
        console.error("Error handling Google callback:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth`);
    }


});


export default router;
