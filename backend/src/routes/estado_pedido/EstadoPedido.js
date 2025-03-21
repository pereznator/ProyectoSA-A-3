const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createEstadoPedido = require("../../components/estado_pedido/create");
const deleteEstadoPedido = require("../../components/estado_pedido/delete");
const readEstadoPedido = require("../../components/estado_pedido/read");
const updateEstadoPedido = require("../../components/estado_pedido/update");
const viewEstadoPedido = require("../../components/estado_pedido/view");
router.post(
  "/",
  // authMiddleware.authorize,
  createEstadoPedido.createEstadoPedido
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateEstadoPedido.updateEstadoPedido
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteEstadoPedido.deleteEstadoPedido
);
router.get("/", authMiddleware.authorize, readEstadoPedido.readEstadoPedido);
router.get("/:id", authMiddleware.authorize, viewEstadoPedido.viewEstadoPedido);

module.exports = router;
