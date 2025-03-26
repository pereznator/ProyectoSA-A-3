const express = require('express');
const router = express.Router();

const { iniciarSesionController, registrarVerificacionEmail, verificarCorreo } = require('../controllers/auth/auth.post.controller');
const { validarTokenController } = require('../controllers/auth/auth.get.controller');
const { cerrarSesion, expirarSesiones } = require('../controllers/auth/auth.put.controller');

router.post('/iniciar-sesion', iniciarSesionController);////

router.post('/registrar-verificacion-email', registrarVerificacionEmail);//

router.get('/validar-token', validarTokenController);//

router.post('/verificar-correo', verificarCorreo);//

router.put('/cerrar-sesion', cerrarSesion);//

router.put('/expirar-sesiones', expirarSesiones);//

module.exports = router;