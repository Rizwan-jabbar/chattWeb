import express from 'express';
import registerController from '../controller/registerController/registerController.js';
import loginController from '../controller/loginController/loginController.js';
import userProfileController from '../controller/userProfileController/userProfileController.js';
import authMiddleware from '../middleWare/authMiddleWare.js';
import sendFriendRequestController from '../controller/friendRequestController/friendRequestController.js';
import friendController from '../controller/friendController/friendController.js';
import messageController from '../controller/messageController/messageController.js';
import upload from '../middleWare/fileMiddleWare.js';
import notificationController from '../controller/notificationController/notificationController.js';
import deactivateAccountController from '../controller/deactivateAccountController/deactivateAccountController.js';

const router = express.Router();

// user register route
router.post('/register', registerController.registerUser);
router.post('/auth/register', registerController.registerUser);
router.get('/registeredUsers' , registerController.getRegisteredUsers)
router.post('/verifyOTP', registerController.verifyOTP);
router.post('/changePassword', authMiddleware, registerController.changePassword);
router.post('/forgetPassword', registerController.forgetPassword);
router.post('/resetPassword', registerController.resetPassword);


// login route
router.post('/login', loginController.loginUser);
router.post('/auth/login', loginController.loginUser);


// user profile route
router.get('/me', authMiddleware, userProfileController.getLoggedInUser);


// Friend request route
router.post('/friendRequest', authMiddleware, sendFriendRequestController.sendFriendRequest);
router.get('/friendRequest', authMiddleware, sendFriendRequestController.getFriendRequests);
router.delete('/friendRequest', authMiddleware, sendFriendRequestController.removeFriendRequest);

// add friend route
router.post('/addFriend', authMiddleware, friendController.addFriend);
router.get('/friends', authMiddleware, friendController.getFriends);
router.delete('/deleteFriend', authMiddleware, friendController.deleteFriend);

// messages route
router.post('/messages', authMiddleware, messageController.sendMessage);
router.get('/messages/:friendId', authMiddleware, messageController.getMessages);
router.patch('/messages/:friendId/read', authMiddleware, messageController.markMessagesAsRead);
router.post('/voiceMessages', authMiddleware, upload.single('audio'), messageController.sendVoiceMessage);
router.post('/pictureMessages', authMiddleware, upload.single('picture'), messageController.sendPictureMessage);
router.post('/callMessages', authMiddleware, messageController.saveVoiceCallHistory);



// notification route
router.post('/notifications', authMiddleware, notificationController.sendNotification);
router.get('/notifications', authMiddleware, notificationController.getNotifications);
router.patch('/notifications/:notificationId', authMiddleware, notificationController.updateNotification);



// deacticate account route
router.post('/deactivate', authMiddleware, deactivateAccountController.deactivateController);



export default router;
