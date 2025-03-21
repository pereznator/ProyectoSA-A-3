const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createEstadoExistencia = require("../../components/estado_existencia/create");
const deleteEstadoExistencia = require("../../components/estado_existencia/delete");
const readEstadoExistencia = require("../../components/estado_existencia/read");
const updateEstadoExistencia = require("../../components/estado_existencia/update");
const viewEstadoExistencia = require("../../components/estado_existencia/view");
router.post(
  "/",
  authMiddleware.authorize,
  createEstadoExistencia.createEstadoExistencia
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateEstadoExistencia.updateEstadoExistencia
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteEstadoExistencia.deleteEstadoExistencia
);
router.get(
  "/",
  authMiddleware.authorize,
  readEstadoExistencia.readEstadoExistencia
);
router.get(
  "/:id",
  authMiddleware.authorize,
  viewEstadoExistencia.viewEstadoExistencia
);

module.exports = router;
