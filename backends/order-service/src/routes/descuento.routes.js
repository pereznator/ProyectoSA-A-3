const express = require('express');
const router = express.Router();

const {generarDescuentoExclusivo} = require('../controllers/descuento/descuento.post.controller');
const {obtenerDescuentoExclusivo} = require('../controllers/descuento/descuento.get.controller');
const {aplicarDescuentoExclusivo} = require('../controllers/descuento/descuento.put.controller')
const {eliminarDescuentoExclusivo} = require('../controllers/descuento/descuento.delete.controller')

// Rutas para el descuento
router.post('/generarDescuentoExclusivo', generarDescuentoExclusivo);

router.get('/obtenerDescuentoExclusivo/:user_id', obtenerDescuentoExclusivo);

router.put('/aplicarDescuentoExclusivo', aplicarDescuentoExclusivo);

router.delete('/eliminarDescuentoExclusivo', eliminarDescuentoExclusivo);

module.exports = router;