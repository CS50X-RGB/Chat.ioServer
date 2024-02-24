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

const containAlpha = (value) => /[a-zA-Z]/.test(value);

const roomSchema = z.object({
        roomno: z.string().min(3, { message: 'Room must have minimum 3 characters' }).max(6).refine(containAlpha,
                { message: 'Room must contain alphabetic characters' }
        )
});
export const validateRoom = (req, res, next) => {
        const { roomno } = req.body;
        try {
                roomSchema.parse({ roomno });
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
                return res.status(400).json({
                        success: false,
                        message: 'Invalid Room no',
                        erros : err
                });
        }
}
export const validatePassword = (req, res, next) => {
        const { newpass } = req.body;
        try {
                passwordSchema.parse({ newpass });
                return next();
        } catch (error) {
                console.error(error);
                return res.status(400).json({
                        success: false,
                        message: 'Password should be at least 6 characters',
                });
        };
}
const isValidEmail = (value) => value.includes("@");
const updateUserSchema = z.object({
        name: z.string().min(3, { message: 'Name cant be of 2 charcs' }).optional(),
        email: z.string().optional().refine(isValidEmail, { message: "Email must contain @" }),
        profilePic: z.string().optional(),
});

export const validateUserDataUpdate = (req, res, next) => {
        const userData = req.body;
        try {
                updateUserSchema.parse(userData);
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
export default { validateUserData, validatePassword, validateUserDataUpdate,validateRoom };