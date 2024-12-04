import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.twixter || req.headers.authorization.replace("Bearer ", "");
        // const token = req.cookies.twixter

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, Token Not Found",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded", decoded);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token!",
            });
        }

        const user = await User.findById(decoded?._id);
        req.user = user;
        next();




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Token Not Found!",
        })
    }
}