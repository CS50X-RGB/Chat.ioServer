import Message from '../Models/message.js';

export const join = async (req, res, next) => {
  try {
    const { roomno } = req.body;
    const user = req.user;
    let message = await Message.findOne({
      sender: user._id,
      room: roomno,
    });
      if (!message) {
      message = new Message({
        sender: user._id,
        room: roomno,
        content: [],
        recivers: [],
      });
    }

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

export const addMessage = async (req, res) => {
  try {
    const { id, roomno } = req.params;
    const { content,recivers } = req.body;
    let message = await Message.findOne({
      sender: id,
      room: roomno,
    });
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or sender and room mismatch',
      });
    }
    message.content.push(content);
    message.reciver.push(recivers);
    await message.save();

    res.status(201).json({
      success: true,
      message: `${content} is sent`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while sending the message',
    });
  }
};
