import Message from "../Models/message.js";

export const createMessageChatid = async (req, res, next) => {
  try {
    const { content, roomno, reciver_id } = req.body; 
    const user = req.user;
    const message = await new Message({
      sender: user._id,
      room: roomno,
      reciver: reciver_id,
      content: content,
    });
    res.status(201).json({
      success: true,
      message: "Message added to the server",
    });
  } catch (error) {
    next(error);
  }
};
