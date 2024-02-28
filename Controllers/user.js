import User from "../Models/user.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/features.js";
import sendEmail from "../utils/sendMail.js";
import generateRandomToken from "../utils/generateRandomToken.js";

export const register = async (req, res, next) => {
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
    user.refresh_user_token = null;
    await user.save();
    console.log("User registered successfully.");
    sendEmail(user.email, `<h1>Welcome ${user.name} to RohanChat.io.
    You can now use our service create Rooms and chat anonymously  with anyone..</h1>`);
    console.log(`Email sent: ${user.email}`);
  } catch (err) {
    console.error(err);
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
    const token = sendToken(user, res, `${user.name} Welcome again`, 200);
    user.user_token = token;
    await user.save();
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    console.log(req.user._id);
    const response = await User.findByIdAndUpdate(
      req.user._id, 
      {
        user_token: null,
        refresh_user_token: null
      },
      { new: true }
    );
    response.markModified('user_token');
    response.markModified('refresh_user_token');
    await response.save();

    console.log(response);
    res
      .clearCookie("ChatIo_Token", {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      .json({
        success: true,
        user: response,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
}


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

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
};
export const ResetPassword = async (req, res) => {
  console.log(`Hi there! ,${req.body}`);
  try {
    const { resetIdentifier } = req.params;
    const { newpass } = req.body;
    console.log(newpass);
    const user = await User.findOne({
      refresh_user_token: resetIdentifier
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired reset link.Please try again"
      });
    }
    user.password = await bcrypt.hash(newpass, 10);
    user.refresh_user_token = undefined
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    })
  }
};
export const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "Email address not found",
      });
    const resetIdentifier = generateRandomToken();
    user.refresh_user_token = resetIdentifier;
    await user.save();
    const resetLink = `https://65df7d6cfec83d4f9ce3d3c9--deluxe-meerkat-f8fd22.netlify.app/resetPassword/${resetIdentifier}`
    sendEmail(user.email, `Click the following link to reset your password : ${resetLink}`);
    return res.status(200).json({
      success: true,
      message: `Password reset instructions sent to your email.Please check your inbox. `,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error. Please try again`,
    });
  }
};

export const UpdateDetails = async (req, res, next) => {
  try {
    const { name, email, profilePic } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized",
      });
    }
    if (name && name !== user.name) {
      user.name = name;
    }
    if (email && email !== user.email) {
      user.email = email;
    }
    if (profilePic && profilePic !== user.profileImage) {
      user.profileImage = profilePic
    }
    await user.save();
    return res.status(200).json({
      success: true,
      message: `User details sucessfully updated`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profileImage
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}