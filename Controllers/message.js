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
        receiver: [],
      });
    }

    await message.save();
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
    const { content, receivers } = req.body;

    const message = await Message.findOne({
      sender: id,
      room: roomno,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or sender and room mismatch',
      });
    }

    message.content.push({
      senderName: content.senderName,
      message: content.message,
    });

    receivers.forEach(receiver => {
      if (!message.receiver.includes(receiver)) {
        message.receiver.push(receiver);
      }
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while sending the message'
    });
  }
};



export const getRecivers = async (req, res) => {
  try {
    const { roomno } = req.params; // Remove 'id' since it's not needed
    const user = req.user;
    
    // Find all messages in the specified room where the user is the sender
    const messages = await Message.find({
      room: roomno,
      sender: user._id,
    });

    if (!messages || messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No messages found for this room and sender',
      });
    }

    // Extract the 'content' field from each message
    const contentArray = messages.map((message) => message.content).flat();

    res.status(200).json({
      success: true,
      content: contentArray,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while fetching content',
    });
  }
}