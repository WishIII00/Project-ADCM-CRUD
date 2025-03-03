// นำเข้า Express
const express = require('express');

// ดึง Router จาก Express
const router = express.Router();
    
// นำเข้า Middleware `auth`
const { auth } = require('../middleware/auth');

const cartController = require('../controllers/cartController');

router.post('/', auth, cartController.addItem);
router.get('/', auth, cartController.getCartById);
router.delete('/removeItem', auth, cartController.removeFromCart);
router.put('/', auth, cartController.updateCart);

//  Export Routes
module.exports = router;
