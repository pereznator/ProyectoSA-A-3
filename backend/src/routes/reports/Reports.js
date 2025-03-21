const router = require("express").Router();

const top_ten_valoracion_producto = require("../../components/retroalimentacion_producto/view_top_ten");
const top_ten_productos_vendidos = require("../../components/detalle_pedido/view_top_ten");

router.get("/top-ten-productos/ventas", top_ten_productos_vendidos.viewTopTen);
router.get(
  "/top-ten-productos/valoracion",
  top_ten_valoracion_producto.viewTopTen
);

module.exports = router;
