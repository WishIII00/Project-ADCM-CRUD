require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const promotionRoutes = require('./routes/promotionRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🔥 ให้เซิร์ฟเวอร์ให้บริการไฟล์จากโฟลเดอร์ `uploads/`
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/promotions', promotionRoutes);

const brandRoutes = require('./routes/brandRoutes');
app.use('/api/brands', brandRoutes);

const cscodeRoutes = require('./routes/cscodeRoutes');
app.use('/api/cscodes', cscodeRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const newProductRoutes = require('./routes/newProductRoutes');
app.use('/api/newProducts', newProductRoutes);

// ให้เซิร์ฟเวอร์ serve ไฟล์จากโฟลเดอร์ uploads/products
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));
app.use('/uploads/promotion', express.static(path.join(__dirname, 'uploads/promotion')));

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'เกิดข้อผิดพลาด'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));