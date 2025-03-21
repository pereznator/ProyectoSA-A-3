const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createRetroalimentacionProducto = require("../../components/retroalimentacion_producto/create");
const deleteRetroalimentacionProducto = require("../../components/retroalimentacion_producto/delete");
const readRetroalimentacionProducto = require("../../components/retroalimentacion_producto/read");
const updateRetroalimentacionProducto = require("../../components/retroalimentacion_producto/update");
const viewRetroalimentacionProducto = require("../../components/retroalimentacion_producto/view");
const retroalimentacionProductoPorProducto = require("../../components/retroalimentacion_producto/por-producto")

router.post(
  "/",
  authMiddleware.authorize,
  createRetroalimentacionProducto.createRetroalimentacionProducto
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateRetroalimentacionProducto.updateRetroalimentacionProducto
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteRetroalimentacionProducto.deleteRetroalimentacionProducto
);
router.get("/producto/:idProducto", retroalimentacionProductoPorProducto.retroalimentacionProductoPorProducto);
router.get("/", authMiddleware.authorize, readRetroalimentacionProducto.readRetroalimentacionProducto);
router.get("/:id", authMiddleware.authorize, viewRetroalimentacionProducto.viewRetroalimentacionProducto);


module.exports = router;
