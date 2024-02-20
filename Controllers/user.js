import User from "../Models/user.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/features.js";
import sendEmail from "../utils/sendMail.js";

export const register = async (req, res, next) => {
  console.log("i am called");
  try {
    const { name, email, password, image } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      profileImage: image,
    });
    const token = sendToken(user, res, `${user.name} welcome !! to RohanChat.io`, 201);
    user.user_token = token;
    user.refresh_user_token = undefined;
    await user.save();
    sendEmail(user.email, `<h1>Welcome ${user.name} to RohanChat.io.
    You can now use our service create Rooms and chat annomosuly  with anyone..</h1>`);
    return res.status(200).json({
      success: true,
      message: `${user.name} Welcome to RohanChat.io`,
      token: user.user_token
    });
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email and password are not correct",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Email and password are not correct",
      });
    }
    const token = sendToken(user, res, `${user.name} welcome !! to RohanChat.io`, 201);
    return res.status(200).json({
      success: true,
      message: `${user.name} Welcome to RohanChat.io`,
      token: token,
    })
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  console.log("LOGOUT called");

  res
    .clearCookie("ChatIo_Token", {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
    .json({
      success: true,
      user: req.user,
    });
};

export const getMyProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const getMyId = async (req, res) => {
  try {
    const { name } = req.params;
    const user = await User.findOne({ name }, "_id");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
};
export const getMyData = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      _id: id
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
};
