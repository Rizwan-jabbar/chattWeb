import Friend from "../../model/friendModel/friendModel.js";
import FriendRequests from "../../model/friendRequestModel/friendRequestModel.js";
import Message from "../../model/messageModel/messageModel.js";
import mongoose from "mongoose";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const addFriend = async (req, res) => {
    const userId = req.user;
    const { friendId, requestId } = req.body;

    if (userId === friendId) {
        return res.status(400).json({ message: "You cannot add yourself as a friend." });
    }

    try {
        const existingFriend = await Friend.findOne({ userId, friendId });

        if (existingFriend) {
            if (requestId) {
                await FriendRequests.findByIdAndDelete(requestId);
            } else {
                await FriendRequests.findOneAndDelete({
                    senderId: friendId,
                    receiverId: userId,
                    status: 'pending'
                });
            }

            return res.status(200).json({ message: "Friend already added." });
        }

        const newFriend = new Friend({
            userId,
            friendId
        });

        await newFriend.save();

        if (requestId) {
            await FriendRequests.findByIdAndDelete(requestId);
        } else {
            await FriendRequests.findOneAndDelete({
                senderId: friendId,
                receiverId: userId,
                status: 'pending'
            });
        }

        res.status(201).json({ message: "Friend added successfully." });
    } catch (err) {
        res.status(500).json({ message: "Error adding friend.", error: err });
    }
};

const getFriends = async (req, res) => {
    const userId = req.user;
    
    try {
        const friends = await Friend.find({
            $or: [{ userId }, { friendId: userId }]
        })
            .populate('userId', 'username email')
            .populate('friendId', 'username email');

        const normalizedFriends = friends.map((friend) => {
            const isOwner = String(friend.userId?._id || friend.userId) === String(userId);
            const otherUser = isOwner ? friend.friendId : friend.userId;

            return {
                _id: friend._id,
                friendId: otherUser,
                createdAt: friend.createdAt,
                updatedAt: friend.updatedAt
            };
        });

        res.status(200).json(normalizedFriends);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching friends.", error: err });
    }
};


const deleteFriend = async (req, res) => {
    const userId = req.user;
    const { friendId } = req.body;

    if (!friendId || !isValidObjectId(friendId)) {
        return res.status(400).json({ message: "Valid friend ID is required." });
    }

    try {
        const deletedFriend = await Friend.findOneAndDelete({
            $or: [
                { userId, friendId },
                { userId: friendId, friendId: userId }
            ]
        });

        if (!deletedFriend) {
            return res.status(404).json({ message: "Friend relationship not found." });
        }

        await Message.deleteMany({
            $or: [
                { sender: userId, recipient: friendId },
                { sender: friendId, recipient: userId }
            ]
        });

        res.status(200).json({
            message: "Friend deleted successfully.",
            friendId
        });
    } catch (err) {
        res.status(500).json({ message: "Error deleting friend.", error: err });
    }
};

const friendController = {
    addFriend, 
    getFriends,
    deleteFriend
};

export default friendController;
