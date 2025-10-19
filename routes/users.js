const controller = require('../controller/user.controller');
const router = require('express').Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);
router.post('/logout', controller.logout);
router.get('/allUsers', controller.getAllUsers);


module.exports = router;