const router = require('express').Router();
const chatController = require('../controller/chat.controller');
const auth = require('../middleware/auth');


router.post('/create', auth, chatController.createChat);
router.get('/:userId', auth, chatController.getUserChatsById);
router.get('/allChats', auth, chatController.getAllChats);
// router.post('/personal', chatController.getOrCreatePersonalChat);
router.post('/group', auth, chatController.createGroupChat);

module.exports = router;