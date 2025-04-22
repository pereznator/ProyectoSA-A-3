const express = require('express');
const router = express.Router();

const {
    crearPromocion,
    asignarPromocion,
    aplicarPromocion,
} = require('../controllers/promotion/promotion.post.controller');

const {
    obtenerPromocionesUsuario,
} = require('../controllers/promotion/promotion.get.controller');

const {
    actualizarPromocion,
} = require('../controllers/promotion/promotion.put.controller');

const {
    eliminarPromocion,
} = require('../controllers/promotion/promotion.delete.controller');



// POST
router.post('/crear-promocion', crearPromocion);
router.post('/asignar-promocion', asignarPromocion);
router.post('/aplicar-promocion', aplicarPromocion);

// PUT
router.put('/actualizar-promocion', actualizarPromocion);

// DELETE
router.delete('/eliminar-promocion/:promotion_id', eliminarPromocion);

// GET
router.get('/obtener-promociones/:user_id', obtenerPromocionesUsuario);

module.exports = router;
