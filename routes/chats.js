const router = require('express').Router();
const chatController = require('../controller/chat.controller');
// const auth = require('../middleware/auth');


router.post('/create', chatController.createChat);
router.get('/allchats', chatController.getAllChats);
router.get('/allchat', chatController.getAllChats);
router.get('/:userId', chatController.getUserChatsById);
// router.post('/personal', chatController.getOrCreatePersonalChat);
router.post('/group', chatController.createGroupChat);

module.exports = router;