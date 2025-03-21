const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createDetalleTarjeta = require("../../components/detalle_tarjeta/create");
const deleteDetalleTarjeta = require("../../components/detalle_tarjeta/delete");
const readDetalleTarjeta = require("../../components/detalle_tarjeta/read");
const updateDetalleTarjeta = require("../../components/detalle_tarjeta/update");
const viewDetalleTarjeta = require("../../components/detalle_tarjeta/view");
router.post(
  "/",
  // authMiddleware.authorize,
  createDetalleTarjeta.createDetalleTarjeta
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateDetalleTarjeta.updateDetalleTarjeta
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteDetalleTarjeta.deleteDetalleTarjeta
);
router.get("/", authMiddleware.authorize, readDetalleTarjeta.readDetalleTarjeta);
router.get(
  "/:id",
  authMiddleware.authorize,
  viewDetalleTarjeta.viewDetalleTarjeta
);

module.exports = router;
