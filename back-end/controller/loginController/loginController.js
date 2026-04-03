import User from "../../model/registerUserModel/registerUserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (req , res) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    const { email , password } = req.body;
    if(!email || !password){
        return res.status(400).json({ message : "Please fill all the fields" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message : "User not found" });
        } else {
            if (!user.isVerified) {
                return res.status(403).json({ message : "Please verify your email before logging in" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message : "Invalid password" });
            }


            if(!JWT_SECRET){
                return res.status(500).json({ message : "JWT secret is not defined" });
            }


            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });  
            res.status(200).json({
                message : "User logged in successfully",
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        }
    } catch (error) {
        res.status(500).json({ message : "Server error" });
    }
}







const loginController = {   
    loginUser,
}
export default loginController;
