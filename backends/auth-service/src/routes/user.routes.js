const express = require('express');
const router = express.Router();

const {crearUsuario, reportarUsuario} = require('../controllers/user/user.post.controller');
const {activarUsuario, actualizarEstadoReporte, actualizarPerfilUsuario, desactivarUsuario} = require('../controllers/user/user.put.controller');
const {obtenerReportesUsuarios, obtenerUsuarioPorId, obtenerUsuariosNoAdmin} = require('../controllers/user/user.get.controller');

router.post('/crear-usuario', crearUsuario);//

router.post('/reportar-usuario', reportarUsuario);//

router.put('/activar-usuario', activarUsuario);//

router.put('/actualizar-estado-reporte', actualizarEstadoReporte);//

router.put('/actualizar-perfil-usuario', actualizarPerfilUsuario);//

router.put('/desactivar-usuario', desactivarUsuario);//

router.get('/obtener-reportes-usuarios', obtenerReportesUsuarios);//

router.get('/obtener-usuario-por-id/:user_id', obtenerUsuarioPorId);//

router.get('/obtener-usuarios-no-admin', obtenerUsuariosNoAdmin);//

module.exports = router;