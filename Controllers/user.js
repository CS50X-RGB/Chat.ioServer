import User from '../Models/user.js';
import bcrypt from 'bcrypt';
import { sendToken } from '../utils/features.js';

export const register = async (req, res, next) => {
    console.log("i am called");
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }
        const hash = await bcrypt.hash(password, 10);
        let user = await User.create({
            name,
            email,
            password: hash,
        })
        sendToken(user, res, `${user.name} welcome !! to RohanChat.io`, 201);
    } catch (err) {
        next(err);
    }
}
export const login = async (req, res, next) => {
    try {
      const { Email, password } = req.body;
      let user = await User.findOne({ Email }).select("+password");
      if (!user) {
      return res.status(400).json({
            success: false,
            message: "Email already exists",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Email already exists",
        });
      }
      sendToken(user, res, `${user.name} welcome !! to RohanChat.io`, 201);
    } catch (error) {
      next(error);
    }
}

export const logout = async(req,res)=>{
    res.status(200).cookie('Token','',{
        expires: new Date(Date.now()),
    }).json({
        sucess:true,
        users : req.user,
    })
}

export const getMyProfile = async(req,res)=>{
    res.status(200).json({
        success: true,
        user: req.user,
    })
}
