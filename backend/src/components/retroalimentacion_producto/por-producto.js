const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const retroalimentacionProductoPorProducto = async (req, res) => {
  const { idProducto } = req.params;
  query_format
    .queryFormat(
      `    
      SELECT 
        rp.id,
        rp.valoracion,
        CONVERT(rp.comentario, CHAR) as comentario,
        rp.cliente_id,
        rp.producto_id,
        DATE_FORMAT(rp.fecha_registro, "%d/%m/%Y %r") as fecha_registro,
        DATE_FORMAT(rp.fecha_update, "%d/%m/%Y %r") as fecha_update,
        CONVERT(c.nombre, CHAR) AS nombre,
        CONVERT(c.apellido, CHAR) AS apellido
    FROM proyecto.retroalimentacion_producto rp
    LEFT JOIN proyecto.cliente c ON c.id = rp.cliente_id
    WHERE producto_id = ?
    `,
    [idProducto]
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
  retroalimentacionProductoPorProducto,
};
