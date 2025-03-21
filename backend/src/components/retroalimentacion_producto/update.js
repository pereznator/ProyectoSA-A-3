const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateRetroalimentacionProducto = async (req, res) => {
  const { id } = req.params;
  const { valoracion, comentario, cliente_id, producto_id } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT 
        valoracion,
        CONVERT(comentario, CHAR) as comentario,
        cliente_id,
        producto_id
        FROM proyecto.retroalimentacion_producto
      WHERE id = ?;
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
            UPDATE proyecto.retroalimentacion_producto
            SET valoracion=?, comentario=?, cliente_id=?, producto_id=?, fecha_update=current_timestamp()
            WHERE id=?;`,
            [
              valoracion == null
                ? response_search.result[0].valoracion
                : valoracion,
              comentario == null
                ? response_search.result[0].comentario
                : comentario,
              cliente_id == null
                ? response_search.result[0].cliente_id
                : cliente_id,
              producto_id == null
                ? response_search.result[0].producto_id
                : producto_id,
              id,
            ]
          )
          .then(async (response_database) => {
            return res.status(200).json({ response_database });
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({ log: error });
          });
      } else {
        return res.status(200).json({ log: "RETROALIMENTACIÓN DE PRODUCTO NO ENCONTRADA" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateRetroalimentacionProducto,
};
