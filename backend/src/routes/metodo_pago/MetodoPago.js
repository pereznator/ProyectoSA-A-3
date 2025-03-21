const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createMetodoPago = require("../../components/metodo_pago/create");
const deleteMetodoPago = require("../../components/metodo_pago/delete");
const readMetodoPago = require("../../components/metodo_pago/read");
const updateMetodoPago = require("../../components/metodo_pago/update");
const viewMetodoPago = require("../../components/metodo_pago/view");
router.post(
  "/",
  // authMiddleware.authorize,
  createMetodoPago.createMetodoPago
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateMetodoPago.updateMetodoPago
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteMetodoPago.deleteMetodoPago
);
router.get("/", authMiddleware.authorize, readMetodoPago.readMetodoPago);
router.get("/:id", authMiddleware.authorize, viewMetodoPago.viewMetodoPago);

module.exports = router;
