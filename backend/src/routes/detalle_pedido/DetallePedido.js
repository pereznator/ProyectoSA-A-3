const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createDetallePedido = require("../../components/detalle_pedido/create");
const deleteDetallePedido = require("../../components/detalle_pedido/delete");
const readDetallePedido = require("../../components/detalle_pedido/read");
const updateDetallePedido = require("../../components/detalle_pedido/update");
const viewDetallePedido = require("../../components/detalle_pedido/view");
router.post(
  "/",
  authMiddleware.authorize,
  createDetallePedido.createDetallePedido
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateDetallePedido.updateDetallePedido
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteDetallePedido.deleteDetallePedido
);
router.get("/", authMiddleware.authorize, readDetallePedido.readDetallePedido);
router.get(
  "/:id",
  authMiddleware.authorize,
  viewDetallePedido.viewDetallePedido
);

module.exports = router;
