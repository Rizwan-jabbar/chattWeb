import Notification from "../../model/notificationModel/notificationModel.js";
import mongoose from "mongoose";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);


const sendNotification = async (req, res) => {
    const senderId = req.user;
    const { recipientId, content } = req.body;

    if(!senderId || !isValidObjectId(senderId)) {
        return res.status(401).json({ message: "Unauthorized. Sender ID is missing." });
    }

    if (!recipientId || !isValidObjectId(recipientId)) {
        return res.status(400).json({ message: "Recipient ID is required." });
    }

    if (!content) {
        return res.status(400).json({ message: "Notification content is required." });
    }

    try {
        const notification = new Notification({
            senderId,
            recipientId,
            content
        });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getNotifications = async (req, res) => {
    const userId = req.user;
    if (!userId || !isValidObjectId(userId)) {
        return res.status(401).json({ message: "Unauthorized. User ID is missing." });
    }

    try {
        const notifications = await Notification.find({ recipientId: userId })
            .populate("senderId", "username email")
            .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateNotification = async (req, res) => {
    const userId = req.user;
    const { notificationId } = req.params;
    if (!userId || !isValidObjectId(userId)) {
        return res.status(401).json({ message: "Unauthorized. User ID is missing." });
    }

    if (!notificationId || !isValidObjectId(notificationId)) {
        return res.status(400).json({ message: "Invalid notification ID." });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
        return res.status(404).json({ message: "Notification not found." });
    }

    if (notification.recipientId.toString() !== userId) {
        return res.status(403).json({ message: "Forbidden. You can only update your own notifications." });
    }

    try {
        notification.isRead = true;
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const notificationController = {
    sendNotification,
    getNotifications,
    updateNotification
};

export default notificationController;
