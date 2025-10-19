const router = require("express").Router();
const authRoutes = require("./users");
const chatRoutes = require("./chats");
const messageRoutes = require("./messages");

console.log('ROUTES DEBUG: authRoutes type=', typeof authRoutes, 'keys=', Object.keys(authRoutes || {}));
console.log('ROUTES DEBUG: chatRoutes type=', typeof chatRoutes, 'keys=', Object.keys(chatRoutes || {}));
console.log('ROUTES DEBUG: messageRoutes type=', typeof messageRoutes, 'keys=', Object.keys(messageRoutes || {}));

router.use("/auth", authRoutes);
router.use("/chats", chatRoutes);
router.use("/messages", messageRoutes);

module.exports = router;
