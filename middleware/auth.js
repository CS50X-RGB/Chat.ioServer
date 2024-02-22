import jwt from 'jsonwebtoken';
import User from '../Models/user.js';

export const isAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized. Please provide a valid JWT token in the Authorization header',
        });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token value is required',
        });
    };
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded._id);
        const user = await User.findOne({ _id : decoded._id });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. User not found or invalid token',
            });
        }
        req.user = user; 
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Invalid or expired token",
        });
    }
};
