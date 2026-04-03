import User from "../../model/registerUserModel/registerUserModel.js";
import Friend from "../../model/friendModel/friendModel.js";
import FriendRequests from "../../model/friendRequestModel/friendRequestModel.js";
import { sendEmail } from "../../utils/sendEmail.js";

const deactivateController = async (req, res) => {
    const userId = req.user;

    try {
        const findAccount = await User.findById(userId);

        if (!findAccount) {
            return res.status(404).json({ message: "User not found." });
        }

        // Email send
        await sendEmail(
            findAccount.email,
            "Account Deactivation Confirmation",
            `Hello ${findAccount.username},\n\nYour account has been successfully deactivated. If you did not request this, please contact support.\n\nBest regards,\nChatWeb Team`
        );

        // Remove friend relationships and pending requests, but keep chat history intact.
        await Friend.deleteMany({
            $or: [{ userId }, { friendId: userId }]
        });

        await FriendRequests.deleteMany({
            $or: [{ senderId: userId }, { receiverId: userId }]
        });

        // Delete user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "Account deactivated successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const deactivateAccountController = {
   deactivateController
};

export default deactivateAccountController;
