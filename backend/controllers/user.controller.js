import User from "../models/user.model.js";




// meProfile
export const meProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");

        return res.status(200).json({
            success: true,
            message: "LoggedIn User Profile",
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

// getProfileById
export const getProfileById = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "UserId Not Found!"
            })
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fteched User by Id",
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