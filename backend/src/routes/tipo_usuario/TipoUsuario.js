const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createTipoUsuario = require("../../components/tipo_usuario/create");
const deleteTipoUsuario = require("../../components/tipo_usuario/delete");
const readTipoUsuario = require("../../components/tipo_usuario/read");
const updateTipoUsuario = require("../../components/tipo_usuario/update");
const viewTipoUsuario = require("../../components/tipo_usuario/view");
router.post("/", authMiddleware.authorize, createTipoUsuario.createTipoUsuario);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateTipoUsuario.updateTipoUsuario
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteTipoUsuario.deleteTipoUsuario
);
router.get("/", authMiddleware.authorize, readTipoUsuario.readTipoUsuario);
router.get("/:id", authMiddleware.authorize, viewTipoUsuario.viewTipoUsuario);

module.exports = router;
