const express = require('express');
const router = express.Router();

const cartRoutes = require('./cart.routes');
const ordersRoutes = require('./orders.routes');
const favoriteRoutes = require('./favorite.routes');
const descuentoRoutes = require('./descuento.routes');
const pagosRoutes = require('./pagos.routes');

router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/favorite', favoriteRoutes);
router.use('/descuento', descuentoRoutes);
router.use('/pagos', pagosRoutes);

module.exports = router;