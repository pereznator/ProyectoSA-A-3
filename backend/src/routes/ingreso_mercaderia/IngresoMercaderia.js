const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createIngresoMercaderia = require("../../components/ingreso_mercaderia/create");
const deleteIngresoMercaderia = require("../../components/ingreso_mercaderia/delete");
const readIngresoMercaderia = require("../../components/ingreso_mercaderia/read");
const updateIngresoMercaderia = require("../../components/ingreso_mercaderia/update");
const viewIngresoMercaderia = require("../../components/ingreso_mercaderia/view");
router.post(
  "/",
  authMiddleware.authorize,
  createIngresoMercaderia.createIngresoMercaderia
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateIngresoMercaderia.updateIngresoMercaderia
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteIngresoMercaderia.deleteIngresoMercaderia
);
router.get(
  "/producto/:idProducto",
  // authMiddleware.authorize,
  readIngresoMercaderia.readIngresoMercaderia
);
router.get(
  "/:id",
  authMiddleware.authorize,
  viewIngresoMercaderia.viewIngresoMercaderia
);

module.exports = router;
