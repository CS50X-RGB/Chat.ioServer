import express from "express";
import { isAuth } from "../middleware/auth.js";
import { join,addMessage,getRecivers} from "../Controllers/message.js";
const router = express.Router();

router.post('/join',isAuth,join);
router.post('/chat/:id/:roomno',isAuth,addMessage);
router.get('/chat/:roomno/:sender',isAuth,getRecivers);
export default router;