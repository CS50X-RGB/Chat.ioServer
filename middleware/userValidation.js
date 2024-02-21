import { z } from 'zod';

const userSchema = z.object({
        name: z.string().min(1),
        profilePic: z.string().min(1),
        user_token: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(6),
        refresh_user_token: z.string().optional(),
        createdAt: z.date().default(() => new Date())
});

export const validateUserData = (req, res, next) => {
        const userData = req.body;
        try {
                userSchema.parse(userData);
                next();
        } catch (error) {
                const err = [];
                for (const validationError of error.errors) {
                        const obj = {
                                path: validationError.path[0],
                                message: validationError.message
                        };
                        err.push(obj);
                }
                console.error('Validation error:', err);
                res.status(400).json({
                        success: false,
                        message: 'Invalid user data',
                        errors: err
                });
        }
};
export default validateUserData;