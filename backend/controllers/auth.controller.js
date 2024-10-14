import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendLoginEmail } from "../utils/emailHandler.js";


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
