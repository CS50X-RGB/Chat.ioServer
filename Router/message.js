import express from "express";
import { isAuth } from "../middleware/auth.js";
import { join,addMessage,getContent} from "../Controllers/message.js";
const router = express.Router();

router.post('/join',isAuth,join);
router.post('/chat/:id/:roomno',isAuth,addMessage);
router.get('/chat/:roomno',isAuth,getContent);
export default router;