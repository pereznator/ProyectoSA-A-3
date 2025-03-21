const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createValidacionPago = require("../../components/validacion_pago/create");
const deleteValidacionPago = require("../../components/validacion_pago/delete");
const readValidacionPago = require("../../components/validacion_pago/read");
const updateValidacionPago = require("../../components/validacion_pago/update");
const viewValidacionPago = require("../../components/validacion_pago/view");
router.post(
  "/",
  // authMiddleware.authorize,
  createValidacionPago.createValidacionPago
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateValidacionPago.updateValidacionPago
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteValidacionPago.deleteValidacionPago
);
router.get("/", authMiddleware.authorize, readValidacionPago.readValidacionPago);
router.get("/:id", authMiddleware.authorize, viewValidacionPago.viewValidacionPago);

module.exports = router;
