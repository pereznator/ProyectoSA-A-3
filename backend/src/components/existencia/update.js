const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateExistencia = async (req, res) => {
  const { id } = req.params;
  const { producto_id, estado_existencia_id, ingreso_mercaderia_id } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT 
        existencia.id,
        CONVERT(existencia.correlativo, CHAR) as correlativo,
        DATE_FORMAT(existencia.fecha_registro,"%d/%m/%Y %r") AS fecha_registro,
        DATE_FORMAT(existencia.fecha_update,"%d/%m/%Y %r") AS fecha_update,
        existencia.producto_id,
        existencia.estado_existencia_id,
        existencia.ingreso_mercaderia_id
      FROM proyecto.existencia
      where id = ?
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
            UPDATE proyecto.existencia
            SET fecha_update=current_timestamp(), producto_id=?, estado_existencia_id=?, ingreso_mercaderia_id=?
            WHERE id=?;`,
            [
              producto_id == null
                ? response_search.result[0].producto_id
                : producto_id,
              estado_existencia_id == null
                ? response_search.result[0].estado_existencia_id
                : estado_existencia_id,
              ingreso_mercaderia_id == null
                ? response_search.result[0].ingreso_mercaderia_id
                : ingreso_mercaderia_id,
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
        return res.status(200).json({ log: "EXISTENCIA NO ENCONTRADA" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateExistencia,
};
