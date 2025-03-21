const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createListaDeseos = require("../../components/lista-deseos/create");
const deleteListaDeseos = require("../../components/lista-deseos/delete");
const readListaDeseos = require("../../components/lista-deseos/read");
const updateListaDeseos = require("../../components/lista-deseos/update");
const viewListaDeseos = require("../../components/lista-deseos/view");
router.post("/",authMiddleware.authorize, createListaDeseos.createListaDeseos);
router.put("/:id",authMiddleware.authorize, updateListaDeseos.updateListaDeseos);
router.delete("/:id",authMiddleware.authorize, deleteListaDeseos.deleteListaDeseos);
router.get("/",authMiddleware.authorize, readListaDeseos.readListaDeseos);
router.get("/:id",authMiddleware.authorize, viewListaDeseos.viewListaDeseos);

module.exports = router;
