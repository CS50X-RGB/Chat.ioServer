import express from "express";
import { isAuth } from "../middleware/auth.js";
import { join,addMessage,getContent, countData} from "../Controllers/message.js";
const router = express.Router();

router.post('/join',isAuth,join);
router.post('/chat/:id/:roomno',isAuth,addMessage);
router.get('/chat/:roomno',isAuth,getContent);
router.get('/:userId',isAuth,countData);
export default router;