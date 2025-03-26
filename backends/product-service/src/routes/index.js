const express = require('express');
const router = express.Router();

const productRoutes = require('./product.routes');

router.use('/product', productRoutes);

module.exports = router;