import User from "../../model/registerUserModel/registerUserModel.js";

const getLoggedInUser = async (req, res) => {
    try {
        const userId = req.user;
        console.log('Decoded user ID in getLoggedInUser:', userId);
        
        if (!userId) {
            return res.status(404).json({ message: "User not found" });
        }

        const user  = await User.findById(userId).select('-password');
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const userProfileController = {
    getLoggedInUser,
}

export default userProfileController