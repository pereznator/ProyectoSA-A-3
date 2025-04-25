const express = require('express');
const router = express.Router();

const { registrarPago } = require('../controllers/pagos/pagos.post.controller');
const { obtenerEstadoPago } = require('../controllers/pagos/pagos.get.controller');

router.post('/registrarPago', registrarPago);
router.get('/obtenerEstadoPago/:order_id', obtenerEstadoPago);

module.exports = router;