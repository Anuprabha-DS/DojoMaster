const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { auth, authorize } = require('../middleware/userMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
// router.post('/register/parent', authController.registerParent);
router.post('/change-password', auth, authController.changePassword)
// router.post('/change-password', auth, authorize(['Admin', 'Master']), authController.changePassword);


module.exports = router;