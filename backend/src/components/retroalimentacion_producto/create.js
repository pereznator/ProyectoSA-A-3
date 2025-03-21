const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const createRetroalimentacionProducto = async (req, res) => {
  const { valoracion, comentario, cliente_id, producto_id } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.retroalimentacion_producto
      ( valoracion, comentario, cliente_id, producto_id, fecha_registro, fecha_update)
      VALUES( ?, ?, ?, ?, current_timestamp(), current_timestamp());`,
      [valoracion, comentario, cliente_id, producto_id]
    )
    .then((response_database) => {
      return res.status(200).json({ response_database });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  createRetroalimentacionProducto,
};
