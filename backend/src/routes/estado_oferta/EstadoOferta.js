const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createEstadoOferta = require("../../components/estado_oferta/create");
const deleteEstadoOferta = require("../../components/estado_oferta/delete");
const readEstadoOferta = require("../../components/estado_oferta/read");
const updateEstadoOferta = require("../../components/estado_oferta/update");
const viewEstadoOferta = require("../../components/estado_oferta/view");
router.post(
  "/",
  authMiddleware.authorize,
  createEstadoOferta.createEstadoOferta
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateEstadoOferta.updateEstadoOferta
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteEstadoOferta.deleteEstadoOferta
);
router.get("/", authMiddleware.authorize, readEstadoOferta.readEstadoOferta);
router.get("/:id", authMiddleware.authorize, viewEstadoOferta.viewEstadoOferta);

module.exports = router;
