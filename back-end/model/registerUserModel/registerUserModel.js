import mongoose from "mongoose"



const registerUserSchema = new mongoose.Schema({
    username: {

        type: String,   
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    } , 
    isVerified: {
        type: Boolean,
        default: false
    }
});


const User = mongoose.model('User', registerUserSchema);
export default User;
