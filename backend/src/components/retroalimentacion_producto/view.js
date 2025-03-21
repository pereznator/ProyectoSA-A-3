const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const viewRetroalimentacionProducto = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
        SELECT 
          valoracion,
          CONVERT(comentario, CHAR) as comentario,
          cliente_id,
          producto_id,
          DATE_FORMAT(fecha_registro, "%d/%m/%Y %r") as fechaRegistro,
          DATE_FORMAT(fecha_update, "%d/%m/%Y %r") as fechaUpdate,
          fecha_registro,
          fecha_update
        FROM proyecto.retroalimentacion_producto
        WHERE id = ?;
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        return res.status(200).json({
          response_database,
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
  viewRetroalimentacionProducto,
};
