import express from "express";
import { isAuth } from "../middleware/auth.js";
import { join,createMessage } from "../Controllers/message.js";
import { createMessageChatid } from "../middleware/createMemeber.js";
const router = express.Router();

router.post('/join',isAuth,join);
router.post('/room/:id', isAuth, createMessageChatid, createMessage);

export default router;