const express = require('express');
const router = express.Router();

const {agregarFavorito} = require('../controllers/favorite/favorite.post.controller')
const {eliminarFavorito} = require('../controllers/favorite/favorite.delete.controller')
const {obtenerFavoritosUsuario} = require('../controllers/favorite/favorite.get.controller')

// router para favoritos
router.post('/agregarFavorito', agregarFavorito);
router.delete('/eliminarFavorito', eliminarFavorito);
router.get('/obtenerFavoritosUsuario/:user_id', obtenerFavoritosUsuario);

module.exports = router;