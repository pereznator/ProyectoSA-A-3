const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createProducto = require("../../components/producto/create");
const deleteProducto = require("../../components/producto/delete");
const readProducto = require("../../components/producto/read");
const updateProducto = require("../../components/producto/update");
const viewProducto = require("../../components/producto/view");
const readProductoSort = require("../../components/producto/read_sort");
const viewProductoSort = require("../../components/producto/view_sort");
const readProductoSortCategoria = require("../../components/producto/read_sort_categoria");
router.post("/", authMiddleware.authorize, createProducto.createProducto);
router.put("/:id", authMiddleware.authorize, updateProducto.updateProducto);
router.delete("/:id", authMiddleware.authorize, deleteProducto.deleteProducto);
router.get("/", readProducto.readProducto);
router.get("/view/:id", viewProducto.viewProducto);
router.get(
  "/read/:precio/:fecha_lanzamiento/:orden_alfabetico",
  readProductoSort.readProductoSort
);
router.get(
  "/buscar/:name/:precio/:fecha_lanzamiento",
  viewProductoSort.viewProductoSort
);

router.get(
  "/categoria/:categoria_producto/:precio/:fecha_lanzamiento/:orden_alfabetico",
  readProductoSortCategoria.readProductoSortCategoria
);
module.exports = router;
