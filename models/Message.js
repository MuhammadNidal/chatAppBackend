const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
},
chat :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
},
content :{
    type: String,
    trim: true,
    required: true
},
    id: {
        type: String,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'file'],
    default: 'text'
},
fileUrl: {
    type: String,
    trim: true
},
isRead: {
    type: Boolean,
    default: false
},
readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
},
{ timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;