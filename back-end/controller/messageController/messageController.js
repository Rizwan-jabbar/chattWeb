import Message from "../../model/messageModel/messageModel.js";
import mongoose from "mongoose";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);


const sendMessage = async (req, res) => {
    const senderId = req.user;
    const { recipientId, content } = req.body;

    if (!senderId || !isValidObjectId(senderId)) {
        return res.status(401).json({ message: "Unauthorized. Invalid sender ID." });
    }

    if (!recipientId || !isValidObjectId(recipientId)) {
        return res.status(400).json({ message: "Recipient ID is required." });
    }

    if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Message content cannot be empty." });
    }
    try {
        const message = new Message({
            sender: senderId,
            recipient: recipientId,
            content: content
        });

        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const sendVoiceMessage = async (req, res) => {
    const senderId = req.user;
    const { recipientId } = req.body;
    if (!senderId || !isValidObjectId(senderId)) {
        return res.status(401).json({ message: "Unauthorized. Invalid sender ID." });
    }

    if (!recipientId || !isValidObjectId(recipientId)) {
        return res.status(400).json({ message: "Recipient ID is required." });
    }

    if (!req.file) {
        return res.status(400).json({ message: "Audio content is required." });
    }
    try {
        const message = new Message({
            sender: senderId,
            recipient: recipientId,
            audio: `uploads/${req.file.filename}`
        });

        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const sendPictureMessage = async (req, res) => {
    const senderId = req.user;
    const { recipientId  } = req.body;
    if (!senderId || !isValidObjectId(senderId)) {
        return res.status(401).json({ message: "Unauthorized. Invalid sender ID." });
    }

    if (!recipientId || !isValidObjectId(recipientId)) {
        return res.status(400).json({ message: "Recipient ID is required." });
    }
    if (!req.file) {
        return res.status(400).json({ message: "Picture content is required." });
    }
    try {
        const message = new Message({
            sender: senderId,
            recipient: recipientId,
            picture: `uploads/${req.file.filename}`
        });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const saveVoiceCallHistory = async (req, res) => {
    const senderId = req.user;
    const { recipientId, duration, status } = req.body;

    if (!senderId || !isValidObjectId(senderId)) {
        return res.status(401).json({ message: "Unauthorized. Invalid sender ID." });
    }

    if (!recipientId || !isValidObjectId(recipientId)) {
        return res.status(400).json({ message: "Recipient ID is required." });
    }

    try {
        const safeDuration = Number.isFinite(Number(duration))
            ? Math.max(0, Math.floor(Number(duration)))
            : 0;
        const safeStatus = ["missed", "declined"].includes(status)
            ? status
            : "completed";

        const message = new Message({
            sender: senderId,
            recipient: recipientId,
            callDetails: {
                type: "voice",
                duration: safeDuration,
                initiatedBy: senderId,
                status: safeStatus
            }
        });

        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getMessages = async (req, res) => {
    const userId = req.user;
    const { friendId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: friendId },
                { sender: friendId, recipient: userId }
            ]
        }).sort({ createdAt: 1 });

        console.log('Retrieved messages:', messages);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markMessagesAsRead = async (req, res) => {
    const userId = req.user;
    const { friendId } = req.params;

    try {
        await Message.updateMany(
            {
                sender: friendId,
                recipient: userId,
                isRead: false
            },
            {
                $set: { isRead: true }
            }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const messageController = {
    sendMessage,
    getMessages,
    sendVoiceMessage,
    sendPictureMessage,
    markMessagesAsRead,
    saveVoiceCallHistory
};


export default messageController;
