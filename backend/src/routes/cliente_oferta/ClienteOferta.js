const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createClienteOferta = require("../../components/cliente_oferta/create");
const deleteClienteOferta = require("../../components/cliente_oferta/delete");
const readClienteOferta = require("../../components/cliente_oferta/read");
const updateClienteOferta = require("../../components/cliente_oferta/update");
const viewClienteOferta = require("../../components/cliente_oferta/view");
router.post(
  "/",
  authMiddleware.authorize,
  createClienteOferta.createClienteOferta
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateClienteOferta.updateClienteOferta
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteClienteOferta.deleteClienteOferta
);
router.get("/", authMiddleware.authorize, readClienteOferta.readClienteOferta);
router.get(
  "/:id",
  authMiddleware.authorize,
  viewClienteOferta.viewClienteOferta
);

module.exports = router;
