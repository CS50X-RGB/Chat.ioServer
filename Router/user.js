import express from "express";
import { register, login, logout, getMyProfile, getMyId, getMyData, ForgetPassword, ResetPassword,UpdateDetails } from "../Controllers/user.js";
import { isAuth } from "../middleware/auth.js";
import { validateUserData, validatePassword } from "../middleware/userValidation.js";

const router = express.Router();

router.post("/register", validateUserData, register);
router.post("/login", login);
router.get("/logout",isAuth, logout);
router.get("/myProfile", isAuth, getMyProfile);
router.get("/getUser/:name", isAuth, getMyId);
router.get("/getUserData/:id", isAuth, getMyData)
router.post("/forgotPassword", ForgetPassword);
router.post('/resetpassword/:resetIdentifier', validatePassword, ResetPassword);
router.put("/updateDetails", isAuth, UpdateDetails);
export default router;
