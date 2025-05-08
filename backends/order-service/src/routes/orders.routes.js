const express = require('express');
const router = express.Router();

const {crearOrdenDesdeCarrito} = require('../controllers/orders/orders.post.controller');
const {obtenerHistorialOrdenes, obtenerDetalleOrden, obtenerMontoTotalAcumulado, obtenerSeguimientoPedido, obtenerTodasLasOrdenes} = require('../controllers/orders/orders.get.controller');
const {actualizarSeguimientoPedido} = require('../controllers/orders/orders.put.controller');

router.post('/crearOrdenDesdeCarrito', crearOrdenDesdeCarrito);

router.get('/obtenerHistorialOrdenes', obtenerHistorialOrdenes);

router.get('/obtenerDetalleOrden/:order_id', obtenerDetalleOrden);

router.get('/obtenerMontoTotalAcumulado', obtenerMontoTotalAcumulado);

router.get('/obtenerTodasOrdenes', obtenerTodasLasOrdenes);

router.get('/obtenerSeguimientoPedido/:order_id', obtenerSeguimientoPedido);

router.put('/actualizarSeguimientoPedido', actualizarSeguimientoPedido);


module.exports = router;