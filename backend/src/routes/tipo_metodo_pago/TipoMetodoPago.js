const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createTipoMetodoPago = require("../../components/tipo_metodo_pago/create");
const deleteTipoMetodoPago = require("../../components/tipo_metodo_pago/delete");
const readTipoMetodoPago = require("../../components/tipo_metodo_pago/read");
const updateTipoMetodoPago = require("../../components/tipo_metodo_pago/update");
const viewTipoMetodoPago = require("../../components/tipo_metodo_pago/view");
router.post(
  "/",
  authMiddleware.authorize,
  createTipoMetodoPago.createTipoMetodoPago
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateTipoMetodoPago.updateTipoMetodoPago
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteTipoMetodoPago.deleteTipoMetodoPago
);
router.get(
  "/",
  authMiddleware.authorize,
  readTipoMetodoPago.readTipoMetodoPago
);
router.get(
  "/:id",
  authMiddleware.authorize,
  viewTipoMetodoPago.viewTipoMetodoPago
);

module.exports = router;
