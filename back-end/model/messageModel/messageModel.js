import mongoose from "mongoose";

const callDetailsSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["voice"],
            required: true
        },
        duration: {
            type: Number,
            default: 0
        },
        initiatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["completed", "missed", "declined"],
            default: "completed"
        }
    },
    {
        _id: false
    }
);

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    audio: {
        type: String,
    },

    picture: {
        type: String,
        },

        isRead: {
            type: Boolean,
            default: false
        },
        callDetails: {
            type: callDetailsSchema,
            default: null
        }
}, {
    timestamps: true
}); 


const Message = mongoose.model('Message', messageSchema);
export default Message;
