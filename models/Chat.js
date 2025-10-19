const mongoose = require('mongoose');


const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
},
groupName: {
    type: String,
    trim: true
},
groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
isGroupChat: {
    type: Boolean,
    default: false

}




}, { timestamps: true }
);


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
