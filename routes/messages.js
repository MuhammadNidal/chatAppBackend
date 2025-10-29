const controller = require('../controller/message.controller');
const router = require('express').Router();
const auth = require('../middleware/auth');


router.get('/allMessages', controller.getAllMessages);
router.get('/:chatId',  controller.getMessagesByChatId);
router.post('/sendmessage', controller.addSendMessage);

module.exports = router;