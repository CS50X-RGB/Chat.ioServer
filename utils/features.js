
import jwt from 'jsonwebtoken';

export const sendToken = (user, res, message, statusCode = 200) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res
        .status(statusCode)
        .cookie("ChatIo_Token", token, {
            httpOnly: true,
            maxAge: 18 * 60 * 60 * 1000, // 18 hours in milliseconds
            secure: true,
            sameSite: "None",
        })
        .json({
            success: true,
            message,
        });
};
