import Message from "../Models/message.js";

export const join = async (req, res, next) => {
  try {
    const { roomno } = req.body;
    const user = req.user;
    const message = await new Message({
      sender: user._id,
      room: roomno,
    });
    message.save();
    res.status(201).json({
      success: true,
      message: `${user.name} joined the room`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Did not work, sorry`,
    });
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const { content, reciver_id } = req.body;
    const user = req.user;
    const message = await Message.findOne({
      sender: user._id,
      room: user.room,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Append the receiver_ids to the receivers array
    message.receivers.push(...reciver_id);

    // Append the new content to the content array
    message.content.push({
      sender: user._id,
      message: content,
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: content,
    });
  } catch (error) {
    next(error);
  }
};
