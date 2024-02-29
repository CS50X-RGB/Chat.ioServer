import jwt from 'jsonwebtoken';

export const sendToken = (user, res, message, statusCode = 200) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res
        .status(statusCode)
        .cookie("ChatIo_Token", token, {
            httpOnly: true,
            maxAge: 18 * 60 * 60 * 1000,
            // sameSite : "none",
            // secure : true
        })
        .json({
            success: true,
            message,
            token : token,
        });
    console.log(token);
    return token;
};
