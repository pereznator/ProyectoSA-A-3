const router = require("express").Router();
const createValoracionPagina = require("../../components/valoracion-pagina/create");
const deleteValoracionPagina = require("../../components/valoracion-pagina/delete");
const readValoracionPagina = require("../../components/valoracion-pagina/read");
const updateValoracionPagina = require("../../components/valoracion-pagina/update");
const viewValoracionPagina = require("../../components/valoracion-pagina/view");
router.post("/", createValoracionPagina.createValoracionPagina);
router.put("/:id", updateValoracionPagina.updateValoracionPagina);
router.delete("/:id", deleteValoracionPagina.deleteValoracionPagina);
router.get("/", readValoracionPagina.readValoracionPagina);
router.get("/:id", viewValoracionPagina.viewValoracionPagina);

module.exports = router;
