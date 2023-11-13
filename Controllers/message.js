// messageController.js
import Message from '../Models/message.js';

export const join = async (req, res, next) => {
  try {
    const { roomno } = req.body;
    const user = req.user;

    const existingMessage = await Message.findOne({
      room: roomno,
      receiver: user._id,
    });

    if (!existingMessage) {
      let message = await Message.findOne({
        room: roomno,
      });

      if (!message) {
        message = new Message({
          sender: user._id,
          room: roomno,
          content: [],
          receiver: [user._id],
        });
      } else {
        if (!message.receiver.includes(user._id)) {
          message.receiver.push(user._id);
        }
      }

      await message.save();
    }

    res.status(201).json({
      success: true,
      message: `${user.name} joined the room`,
      room: { roomno },  // Include room details in the response
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

    let message = await Message.findOne({
      room: roomno,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'No message found for the specified room',
      });
    }

    if (!message.sender && message.room) {
      // If the sender is not present but the room exists, update the sender
      message.sender = id;
      console.log('Updated sender...', message.sender);
    }

    // Rest of the code remains unchanged...

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

    const responseMessage = 'Message sent successfully';
    const responseData = {
      success: true,
      message: responseMessage,
      sender: content.senderName,
    };
    console.log(responseData);
    res.status(200).json(responseData);  // Use a more descriptive status code
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while sending the message',
    });
  }
};


export const getContent = async (req, res) => {
  try {
    const { roomno } = req.params;
    const messages = await Message.find({
      room: roomno,
    });

    if (!messages || messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No messages in this room',
      });
    }

    const contentArray = messages.map((message) =>
      message.content.map((contentItem) => contentItem)
    );

    const flattenedContentArray = contentArray.flat();

    res.status(200).json({
      success: true,
      content: flattenedContentArray,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      content: 'An unexpected error occurred while fetching content',
    });
  }
};

export const countData = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await Message.find({
      sender: userId,
    });

    res.status(200).json({
      success: true,
      message: data,
      userId: userId,  // Include user ID in the response
    });
    console.log(data);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
