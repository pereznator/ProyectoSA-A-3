const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const viewExistencia = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
      SELECT 
        existencia.id,
        CONVERT(existencia.correlativo, CHAR) as correlativo,
        existencia.fecha_registro,
        existencia.fecha_update,
        DATE_FORMAT(existencia.fecha_registro,"%d/%m/%Y %r") AS fechaRegistro,
        DATE_FORMAT(existencia.fecha_update,"%d/%m/%Y %r") AS fechaUpdate,
        existencia.producto_id,
        existencia.estado_existencia_id,
        existencia.ingreso_mercaderia_id,
        CONVERT(producto.nombre, CHAR) as producto, 
        CONVERT(estado_existencia.descripcion, CHAR) as estado_existencia,
        CONVERT(ingreso_mercaderia.correlativo, CHAR) as ingreso_mercaderia
      FROM proyecto.existencia
      INNER JOIN producto on existencia.producto_id = producto.id
      INNER JOIN estado_existencia on existencia.estado_existencia_id = estado_existencia.id
      INNER JOIN ingreso_mercaderia on existencia.ingreso_mercaderia_id = ingreso_mercaderia.id
      where existencia.id = ?
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        return res.status(200).json({
          response_database,
        });
      } else {
        return res.status(200).json({ log: "EXISTENCIA NO ENCONTRADA" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewExistencia,
};
