const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const viewValidacionPago = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
      SELECT 
      id,
      DATE_FORMAT(fecha_registro,"%d/%m/%Y %r" ) as fechaRegistro,
      fecha_registro,
      DATE_FORMAT(fecha_update, "%d/%m/%Y %r") as fechaUpdate,
      fecha_update,
      colaborador_id,
      pago_id
    FROM proyecto.validacion_pago 
    WHERE id = ?
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        return res.status(200).json({
          response_database,
        });
      } else {
        return res.status(200).json({ log: "VALIDACIÓN PAGO NO ENCONTRADA" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewValidacionPago,
};
