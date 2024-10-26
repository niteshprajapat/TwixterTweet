import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";




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

// followUnnfollowByID
export const followUnfollowByID = async (req, res) => {
    try {
        const userId = req.params.id;
        const loggedInUserId = req.user._id;


        if (userId?.toString() === loggedInUserId?.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow/unfollow yourself!",
            });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!"
            });
        }


        const loggedInUser = await User.findById(loggedInUserId).select("-password");


        if (loggedInUser?.following?.includes(userId)) {
            // unfollow

            await User.findByIdAndUpdate(loggedInUserId, { $pull: { following: userId } }, { new: true });
            await User.findByIdAndUpdate(userId, { $pull: { followers: loggedInUserId } }, { new: true });

            return res.status(200).json({
                success: true,
                message: `${loggedInUser?.userName} unfollowed ${user?.userName}`,
            });

        } else {
            // follow

            await User.findByIdAndUpdate(loggedInUserId, { $push: { following: userId } }, { new: true });
            await User.findByIdAndUpdate(userId, { $push: { followers: loggedInUserId } }, { new: true });



            // send notifications and email
            const notification = new Notification({
                from: loggedInUserId,
                to: userId,
                type: "follow",
            });

            await notification.save();

            return res.status(200).json({
                success: true,
                message: `${loggedInUser?.userName} followed ${user?.userName}`,
            });

        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}


// getSuggestedUsers
export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following");


        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                }
            },
            { $sample: { size: 10 } },
        ]);


        const filteredUser = users.filter((user) => !userFollowedByMe.following.includes(user?._id));
        const suggestedUsers = filteredUser?.slice(5);

        suggestedUsers?.forEach((user) => (user.password = null));

        return res.status(200).json({
            success: true,
            message: "All Suggested Users Fetched Successfully.",
            suggestedUsers,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// searchAccount - by username, name
export const searchAccount = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Please provide query!",
            });
        }

        const users = await User.find({
            $or: [
                { userName: { $regex: query, $options: 'i' } },
                { fullName: { $regex: query, $options: 'i' } },
            ]
        }).select("-password");



        if (!users?.length) {
            return res.status(200).json({
                success: true,
                message: "Account Not Found!",
                users: [],
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetched Accounts!",
            users,
        })




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}


// deleteAccount
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            })
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Account Not Found!",
            });
        }


        return res.status(200).json({
            success: true,
            message: "Account Deleted Successfully!",
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

// followingList
export const followingList = async (req, res) => {
    try {

        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            })
        }

        const user = await User.findById(userId).populate({
            path: "following",
            select: "-password",
        })


        const userFollowing = user.following;

        return res.status(200).json({
            success: true,
            message: "User Following List!",
            userFollowing,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// followingList
export const followersList = async (req, res) => {
    try {

        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            })
        }

        const user = await User.findById(userId).populate({
            path: "followers",
            select: "-password",
        })


        const userFollowers = user.followers;

        return res.status(200).json({
            success: true,
            message: "User Following List!",
            userFollowers,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// updateProfile
export const updateProfile = async (req, res) => {
    try {

        const userId = req.user._id;

        const { fullName, userName, email, bio, avatar, coverImage, socialLink } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: { fullName, userName, email, bio, avatar, coverImage, socialLink }
            },
            { new: true },
        );


        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully!",
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