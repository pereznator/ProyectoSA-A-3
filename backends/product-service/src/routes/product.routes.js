const express = require('express');
const router = express.Router();

const {crearProducto, agregarReviewProducto} = require('../controllers/product/product.post.controller');
const {obtenerProductos, obtenerProducto} = require('../controllers/product/product.get.controller');

router.post('/crear-producto', crearProducto);
router.post('/agregar-review-producto', agregarReviewProducto);
router.get('/obtener-productos', obtenerProductos);
router.get('/obtener-producto-por-id/:product_id', obtenerProducto);


module.exports = router;