import User from "../../model/registerUserModel/registerUserModel.js";
import PendingVerification from "../../model/pendingVerificationModel/pendingVerificationModel.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/sendEmail.js";

const registerUser = async (req , res) => {

    const { username , email , password } = req.body;

    if(!username || !email || !password){
        return res.status(400).json({ message : "Please fill all the fields" });
    }

    if(password.length < 6){
        return res.status(400).json({ message : "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message : "User already exists" });
    }

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailFormat.test(email)) {
        return res.status(400).json({ message : "Invalid email format" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message : "User already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        await PendingVerification.findOneAndDelete({ email });

        await PendingVerification.create({
            username,
            email,
            otp,
            otpExpires,
            password: hashedPassword,
        });

        await sendEmail(email, "Your OTP Code", `Your OTP code is: ${otp}`);

        res.status(201).json({
            message : "OTP sent successfully",
            email
        });
    } catch (error) {
        if (email) {
            await PendingVerification.findOneAndDelete({ email }).catch(() => {});
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message : error.message || "Server error" });
    }


}


const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const pendingVerification = await PendingVerification.findOne({
            email,
            otp,
            otpExpires : { $gt : Date.now() }
        });

        if (!pendingVerification) {
            return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            await PendingVerification.findOneAndDelete({ email });
            return res.status(409).json({ message: "User already exists" });
        }

        const user = await User.create({
            username: pendingVerification.username,
            email: pendingVerification.email,
            password: pendingVerification.password,
            isVerified: true
        });

        await PendingVerification.findOneAndDelete({ email });

        user.isVerified = true;

        res.status(200).json({
            message: "OTP verified successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};


const changePassword = async (req, res) => {
    const userId = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required" });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

const getRegisteredUsers = async (req, res) => {
    try {
        const { email, excludeUserId } = req.query;
        const query = {};

        if (email && email.trim()) {
            query.email = email.trim().toLowerCase();
        }

        if (excludeUserId) {
            query._id = { $ne: excludeUserId };
        }

        const users = await User.find(query, 'username email').limit(8);
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}




const forgetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendEmail(email, "Your Password Reset OTP", `Your OTP code for password reset is: ${otp}`);

        res.status(200).json({
            message: "Password reset OTP sent successfully",
            email
        });
    } catch (error) {
        if (email) {
            await User.updateOne(
                { email },
                { $unset: { otp: 1, otpExpires: 1 } }
            ).catch(() => {});
        }

        res.status(500).json({ message: error.message || "Server error" });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    try {
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


const registerController = {
    registerUser,
    getRegisteredUsers,
    verifyOTP,
    changePassword,
    forgetPassword,
    resetPassword
}

export default registerController;
