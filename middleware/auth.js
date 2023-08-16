import User from "../Models/user.js";
import jwt from 'jsonwebtoken';

export const isAuth = async (req, res, next) => {
    const { Token } = req.cookies;
    if (!Token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Please login first",
        });
    }
    try {
        const decoded = jwt.verify(Token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Invalid token",
        });
    }
};
