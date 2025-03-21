const query = require("../../helpers/database/mysql/operation/query");
const viewTopTen = async (req, res) => {
  query
    .query(
      `
      select 
        count(*) as ventas,
        sum(detalle_pedido.cantidad*producto.precio) as ingresos,
        convert(producto.nombre, char) as producto,
        convert(producto.descripcion , char) as descripcion_producto,
        convert(producto.portada , char) as portada_producto,
        producto.precio,
        producto.id
      from detalle_pedido 
      inner join producto on detalle_pedido.producto_id = producto.id
      group by producto.id 
      order by ventas desc limit 10;
`
    )
    .then((response_database) => {
      return res.status(200).json({
        response_database,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewTopTen,
};
