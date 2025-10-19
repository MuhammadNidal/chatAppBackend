const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Message = require('../models/Message');


async  function getMessagesByChatId(req, res) {

    try {
        // validate chatId is a valid ObjectId to avoid Mongoose CastError
        const { chatId } = req.params;
        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({ msg: 'Invalid chatId' });
        }
        const page =parseInt(req.query.page) || 1;
        const limit =parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        // const chatId = req.params.chatId;

            const chat = await Chat.findOne({
                _id: req.params.chatId,
                participants: { $in: [req.user._id] }
            });
        if(!chat){
            return res.status(404).json({msg:'Chat not found or access denied'});
        }

        const messages = await Message.find({chat: req.params.chatId})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate('sender','-password')
        .populate('chat'); await Message.updateMany(
            {
                chat: req.params.chatId,
                                sender: { $ne: req.user._id },
                isRead: false
            },
      {
        $set: { isRead: true },
        $push: {
          readBy: {
                        user: req.user._id,
            readAt: new Date()
          }
        }
      }
    );

    res.json(messages.reverse());
    }
    catch (error) {
        console.error('getMessagesByChatId error:', error);
        return res.status(500).json({msg:'Server error'});
    }
}


async function getAllMessages(req, res) {
    try {
        const messages = await Message.find({})
            .populate('sender', '-password')
            .populate('chat')
            .sort({ createdAt: -1 });
        return res.status(200).json(messages);
    } catch (error) {
        console.error('getAllMessages error:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
}


async function addSendMessage(req, res) {
    try {
        const { chatId, content } = req.body || {};
        if (!chatId || !content) {
            return res.status(400).json({ msg: 'chatId and content are required' });
        }

        const chat = await Chat.findOne({
            _id: chatId,
            participants: { $in: [req.user._id] }
        });
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found or access denied' });
        }
        
        const newMessage = new Message({
            sender: req.user._id,
            content,
            chat: chatId,
            messageType: req.body.messageType || 'text'
        });
        await newMessage.save();
        await newMessage.populate('sender', '-password');

        chat.lastMessage = newMessage._id;
        await chat.save();
        return res.status(201).json(newMessage);
    } catch (error) {
        console.error('addSendMessage error:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
}

module.exports = {
    getMessagesByChatId,
    addSendMessage,
    getAllMessages
};