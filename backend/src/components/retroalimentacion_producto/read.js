const query = require("../../helpers/database/mysql/operation/query");

const readRetroalimentacionProducto = async (req, res) => {
  query
    .query(
      `    
      SELECT 
        id,
        valoracion,
        CONVERT(comentario, CHAR) as comentario,
        cliente_id,
        producto_id,
        DATE_FORMAT(fecha_registro, "%d/%m/%Y %r") as fecha_registro,
        DATE_FORMAT(fecha_update, "%d/%m/%Y %r") as fecha_update
    FROM proyecto.retroalimentacion_producto;
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
  readRetroalimentacionProducto,
};
