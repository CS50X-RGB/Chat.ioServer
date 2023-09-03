import express from "express";
import { register, login, logout, getMyProfile } from "../Controllers/user.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/myProfile", isAuth, getMyProfile);
export default router;
