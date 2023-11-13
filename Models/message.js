import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    unique: true,  // Corrected syntax for unique option
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  content: [
    {
      senderName: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
