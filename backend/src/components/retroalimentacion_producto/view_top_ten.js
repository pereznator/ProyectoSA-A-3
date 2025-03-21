const query = require("../../helpers/database/mysql/operation/query");
const viewTopTen = async (req, res) => {
  query
    .query(
      `
      SELECT 
        count(*) as cantidad_votos,
        AVG(valoracion) as avg_valoracion,
        convert(producto.nombre, char) as producto,
        convert(producto.descripcion , char) as descripcion_producto,
        convert(producto.portada , char) as portada_producto,
        producto.precio,
        producto.id
      FROM retroalimentacion_producto
      inner join producto on retroalimentacion_producto.producto_id  = producto.id
      group by producto.id 
      order by avg_valoracion desc limit 10;
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
