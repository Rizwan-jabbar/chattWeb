import User from '../../model/registerUserModel/registerUserModel.js';
import FriendRequests from '../../model/friendRequestModel/friendRequestModel.js';


const sendFriendRequest = (req, res) => {
    const senderId = req.user;
    console.log('Authenticated user ID:', senderId);

    if (!senderId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { receiverId } = req.body;

    if (!receiverId) {
        return res.status(400).json({ message: 'Receiver ID is required' });
    }

    User.findById(receiverId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (receiverId === senderId) {
                return res.status(400).json({ message: 'Cannot send friend request to yourself' });
            }


        

            
            const newFriendRequest = new FriendRequests({
                senderId,
                receiverId,
                status: 'pending',
            });
            newFriendRequest.save()
                .then(() => res.status(200).json({ message: 'Friend request sent successfully' }))
                .catch(err => res.status(500).json({ error: 'Failed to send friend request' }));
        })
        .catch(err => res.status(500).json({ error: 'Failed to find user' }));
};



const removeFriendRequest = (req, res) => {
    const receiverId = req.user;
    const { senderId } = req.body;
    if (!receiverId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!senderId) {
        return res.status(400).json({ message: 'Sender ID is required' });
    }
    FriendRequests.findOneAndDelete
    ({
        senderId,
        receiverId,
        status: 'pending'
    })
        .then(() => res.status(200).json({ message: 'Friend request removed successfully' }))
        .catch(err => res.status(500).json({ error: 'Failed to remove friend request' }));
};


const getFriendRequests = (req, res) => {
    const userId = req.user;

    FriendRequests.find({ receiverId: userId, status: 'pending' })
        .populate('senderId', 'username email')
        .then(friendRequests => res.status(200).json(friendRequests))
        .catch(err => res.status(500).json({ error: 'Failed to retrieve friend requests' }));
}

const friendRequestController = {
    sendFriendRequest,
    getFriendRequests,
    removeFriendRequest
};
export default friendRequestController;
