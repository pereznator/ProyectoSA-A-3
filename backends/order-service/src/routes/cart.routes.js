const express = require('express');
const router = express.Router();

const {agregarProductoCarrito} = require('../controllers/cart/cart.post.controller')
const {eliminarProductoCarrito, limpiarCarritoUsuario} = require('../controllers/cart/cart.delete.controller')
const {obtenerCarritoUsuario} = require('../controllers/cart/cart.get.controller')

// Rutas para el carrito
router.post('/agregarProductoCarrito', agregarProductoCarrito);

router.delete('/eliminarProductoCarrito', eliminarProductoCarrito);
router.delete('/limpiarCarritoUsuario', limpiarCarritoUsuario);

router.get('/obtenerCarritoUsuario/:user_id', obtenerCarritoUsuario);



module.exports = router;