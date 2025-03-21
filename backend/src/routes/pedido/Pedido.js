const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createPedido = require("../../components/pedido/create");
const deletePedido = require("../../components/pedido/delete");
const readPedido = require("../../components/pedido/read");
const updatePedido = require("../../components/pedido/update");
const viewPedido = require("../../components/pedido/view");
const { readPedidoPorCliente } = require("../../components/pedido/porCliente");
router.post("/", authMiddleware.authorize, createPedido.createPedido);
router.put("/:id", authMiddleware.authorize, updatePedido.updatePedido);
router.delete("/:id", authMiddleware.authorize, deletePedido.deletePedido);
router.get("/", authMiddleware.authorize, readPedido.readPedido);
router.get("/cliente/:idCliente", authMiddleware.authorize, readPedidoPorCliente);
router.get("/:id", authMiddleware.authorize, viewPedido.viewPedido);

module.exports = router;
