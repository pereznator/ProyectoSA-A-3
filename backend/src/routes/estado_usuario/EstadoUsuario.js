const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createEstadoUsuario = require("../../components/estado_usuario/create");
const deleteEstadoUsuario = require("../../components/estado_usuario/delete");
const readEstadoUsuario = require("../../components/estado_usuario/read");
const updateEstadoUsuario = require("../../components/estado_usuario/update");
const viewEstadoUsuario = require("../../components/estado_usuario/view");
router.post(
  "/",
  authMiddleware.authorize,
  createEstadoUsuario.createEstadoUsuario
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateEstadoUsuario.updateEstadoUsuario
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteEstadoUsuario.deleteEstadoUsuario
);
router.get("/", authMiddleware.authorize, readEstadoUsuario.readEstadoUsuario);
router.get(
  "/:id",
  authMiddleware.authorize,
  viewEstadoUsuario.viewEstadoUsuario
);

module.exports = router;
