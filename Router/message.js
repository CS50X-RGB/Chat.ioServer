import express from "express";
import { isAuth } from "../middleware/auth.js";
import { validateRoom } from "../middleware/userValidation.js";
import { join,addMessage,getContent, countData} from "../Controllers/message.js";
const router = express.Router();

router.post('/join',isAuth,validateRoom,join);
router.post('/chat/:id/:roomno',isAuth,addMessage);
router.get('/chat/:roomno',isAuth,getContent);
router.get('/:userId',isAuth,countData);
export default router;