import Message from "../Models/message.js";

export const join = async (req, res, next) => {
  try {
    const { roomno, reciver_id } = req.body;
    const user = req.user;
    const message = await new Message({
      sender: user._id,
      room: roomno,      
      reciver: reciver_id,
    });
    res.status(201).json({
      success: true,
      message: `${user.name} joined the room`,
    });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async(req,res,next) =>{
    try {
        const {content} = req.body;
        const user = req.user;
        const message = await new Message({
            sender: user._id,
            content: content
        })
        res.status(201).json({
            success: true,
            message : "Message added to the server",
        })
    } catch (error) {
        next(error);
    }
}