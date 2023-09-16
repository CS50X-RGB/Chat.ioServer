import express from "express";
import { register, login, logout, getMyProfile, getMyId } from "../Controllers/user.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/myProfile", isAuth, getMyProfile);
router.get("/getUser/:name",isAuth,getMyId);
export default router;
