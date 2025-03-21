const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createOferta = require("../../components/oferta/create");
const deleteOferta = require("../../components/oferta/delete");
const readOferta = require("../../components/oferta/read");
const updateOferta = require("../../components/oferta/update");
const viewOferta = require("../../components/oferta/view");
router.post("/", authMiddleware.authorize, createOferta.createOferta);
router.put("/:id", authMiddleware.authorize, updateOferta.updateOferta);
router.delete("/:id", authMiddleware.authorize, deleteOferta.deleteOferta);
router.get("/", readOferta.readOferta);
router.get("/:id", authMiddleware.authorize, viewOferta.viewOferta);

module.exports = router;
