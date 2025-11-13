const express = require('express');
const Chat = require('../models/Chat');
const Message =require('../models/Message');
const User = require('../models/User');


async function createChat(req, res) {
try {
    const { userId } = req.body || {};
    if (!userId) {
        return res.status(400).json({ msg: 'userId and currentUserId are required' });
    }

    // find existing one-to-one chat between the two users
    const existingChat = await Chat.findOne({
        isGroupChat: false,
        participants: { $all: [ userId], $size: 2 }
    }).populate('participants', '-password').populate('lastMessage');

    if (existingChat) {
        return res.status(200).json(existingChat);
    }

    const newChat = new Chat({
        participants: [ userId],
        isGroupChat: false
    });
    await newChat.save();
    const fullChat = await Chat.findById(newChat._id).populate('participants', '-password');
    return res.status(201).json(fullChat);
} catch (error) {
    console.error('createChat error:', error);
    return res.status(500).json({ msg: 'Server error' });
}

}

async function getUserChatsById(req, res) {
    try {
        const { userId } = req.params;
        const chats = await Chat.find({
                participants: userId
            })
            .populate('participants', '-password').populate('lastMessage')
        .sort({ updatedAt: -1 });
        return res.status(200).json(chats);
    } catch (error) {
        console.error('getUserChats error:', error);
        return res.status(500).json({ msg: 'Server error' });
    }

}

async function getAllChats(req, res) {
    try {
        const chats = await Chat.find({})
            .populate('participants', '-password')
            .populate('groupAdmin', '-password')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });
            return res.status(200).json(chats);
    } catch (error) {
        console.error('getAllChats error:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
}

// async function getOrCreatePersonalChat(req, res) {

// }

async function createGroupChat(req, res) {
    try {
        const { groupName, participants } = req.body || {};
        if (!groupName || !participants || participants.length < 2) {
            return res.status(400).json({ msg: 'groupName and at least 2 participants are required' });
        }
        const chat = new Chat({
            groupName,
            participants: [...participants, req.user._id],
            isGroupChat: true,
            groupAdmin: req.user._id
        });
    await chat.save();
    return res.status(201).json(chat);
    } catch (error) {
        console.error('createGroupChat error:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
}


module.exports = {
    createChat,
    getUserChatsById,
    getAllChats,
    // getOrCreatePersonalChat,
    createGroupChat
};