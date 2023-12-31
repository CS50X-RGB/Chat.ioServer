import jwt from 'jsonwebtoken';

export const sendToken = (user, res, message, statusCode = 200) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res
        .status(statusCode)
        .cookie("ChatIo_Token", token, {
            httpOnly: true,
            maxAge: 18 * 1000 * 60*60*60,
            secure : true,  
            sameSite: "None",
        })
        .json({
            success: true,
            message,
        });
};
