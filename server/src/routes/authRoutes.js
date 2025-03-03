const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const adminAuth = auth.adminAuth;

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verifyOTP', authController.verifyOTP);
router.post('/addAdmin', adminAuth, authController.registerAdmin);

module.exports = router;