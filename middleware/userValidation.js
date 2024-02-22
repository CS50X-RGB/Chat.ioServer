import { z } from 'zod';

const userSchema = z.object({
        name: z.string().min(1, { message: 'Name cant be empty' }),
        image: z.string().min(1),
        user_token: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(6, { message: 'Password should be at least 6 characters' }),
        refresh_user_token: z.string().optional(),
        createdAt: z.date().default(() => new Date())
});

const passwordSchema = z.object({
        newpass: z.string().min(6)
});

export const validatePassword = (req, res, next) => {
        const { newpass } = req.body;
        try {
                passwordSchema.parse({ newpass });
                console.log("Ho gym Password");
                return next();
        } catch (error) {
                console.error(error);
                return res.status(400).json({
                        success: false,
                        message: 'Password should be at least 6 characters',
                });
        };
}

export const validateUserData = (req, res, next) => {
        const userData = req.body;
        try {
                userSchema.parse(userData);
                return next();
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
                return res.status(400).json({
                        success: false,
                        message: 'Invalid user data',
                        errors: err,
                });
        }
};
export default { validateUserData, validatePassword };