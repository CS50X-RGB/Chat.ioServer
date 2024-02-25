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
                        erros: err
                });
        }
}
export const validatePassword = (req, res, next) => {
        const { newpass } = req.body;
        try {
                passwordSchema.parse({ newpass });
                next();
        } catch (error) {
                console.error(error);
                return res.status(400).json({
                        success: false,
                        message: 'Password should be at least 6 characters',
                });
        };
}

const isValidEmail = (value) => typeof value === "string" && value.includes("@");

export const validateUserDataUpdate = (req, res, next) => {
        const userData = req.body;
        console.log(userData);

        const updateSchemaFields = {};

        if (userData.name !== undefined) {
                updateSchemaFields.name = z.string().min(3, { message: "Name can't be less than 3 characters" });
        }

        if (userData.email !== undefined) {
                updateSchemaFields.email = z.string().refine(isValidEmail, { message: "Email must contain @" });
        }

        if (userData.profilePic !== undefined) {
                updateSchemaFields.profilePic = z.string();
        }

        const updateUserSchema = z.object(updateSchemaFields).nonstrict();

        try {
                updateUserSchema.parse(userData);
                console.log("Data is valid:", userData);
                next();
        } catch (error) {
                const err = [];
                console.log("Validation error:", error);
                if (error.errors) {
                        for (const validationError of error.errors) {
                                const obj = {
                                        path: validationError.path[0],
                                        message: validationError.message,
                                };
                                err.push(obj);
                        }
                } else {
                        err.push({ message: "Unknown validation error" });
                }
                console.error("Validation error:", err);
                return res.status(400).json({
                        success: false,
                        message: "Invalid user data",
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
export default { validateUserData, validatePassword,validateUserDataUpdate, validateRoom };