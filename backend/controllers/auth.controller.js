import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendLoginEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../utils/emailHandler.js";


// register
export const register = async (req, res) => {
    try {
        const { fullName, userName, email, password } = req.body;

        if (!fullName || !userName || !email || !password) {
            return res.status(404).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const userNameExist = await User.findOne({ userName });
        if (userNameExist) {
            return res.status(400).json({
                success: false,
                message: "UserName already Exists!",
            });
        }

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({
                success: false,
                message: "Email already Exists!",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            fullName,
            userName,
            email,
            password: hashedPassword,
        });


        user.password = null;

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully!",
            user,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}


// login
export const login = async (req, res) => {
    try {
        const { userData, password } = req.body;

        if (!userData || !password) {
            return res.status(404).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const user = await User.findOne({
            $or: [{ userName: userData }, { email: userData }],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!",
            });
        }

        const isPasswordMatched = bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials!",
            });
        }


        // token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });


        user.password = null;

        await sendLoginEmail(user.email);

        return res.status(200).cookie("twixter", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        }).json({
            success: true,
            message: "User LoggedIn Successfully!",
            user,
        })




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// logout
export const logout = async (req, res) => {
    try {

        return res.status(200).cookie("twixter", "", {
            httpOnly: true,
            maxAge: 0,
        }).json({
            success: true,
            message: "User LoggedOut Successfully!",
        })




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}


// forgotPassword
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!",
            });
        }

        const resetToken = crypto.randomBytes(40).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        await sendPasswordResetEmail(email, `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`);

        return res.status(200).json({
            success: true,
            message: "Password reset link send to your email address!",
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}




// resetPassword
export const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.token;
        const { newPassword } = req.body;

        const user = await User.findOne({ resetPasswordToken: resetToken, resetPasswordTokenExpiresAt: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token!",
            });
        }

        // update Password

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetTokenExpiresAt = undefined;

        await user.save();

        // send success reset email
        await sendResetSuccessEmail(user.email);


        return res.status(200).json({
            success: true,
            message: "Password reset successfully!",
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}



