const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createCategoriaProducto = require("../../components/categoria_producto/create");
const deleteCategoriaProducto = require("../../components/categoria_producto/delete");
const readCategoriaProducto = require("../../components/categoria_producto/read");
const updateCategoriaProducto = require("../../components/categoria_producto/update");
const viewCategoriaProducto = require("../../components/categoria_producto/view");
router.post("/",authMiddleware.authorize, createCategoriaProducto.createCategoriaProducto);
router.put("/:id",authMiddleware.authorize, updateCategoriaProducto.updateCategoriaProducto);
router.delete("/:id",authMiddleware.authorize, deleteCategoriaProducto.deleteCategoriaProducto);
router.get("/", readCategoriaProducto.readCategoriaProducto);
router.get("/:id", viewCategoriaProducto.viewCategoriaProducto);

module.exports = router;
