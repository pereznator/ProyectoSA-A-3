const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateValidacionPago = async (req, res) => {
  const { id } = req.params;
  const { colaborador_id, pago_id } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT 
        colaborador_id,
         pago_id
      FROM proyecto.validacion_pago;
      where id = ?
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
            UPDATE proyecto.validacion_pago
            SET fecha_update=current_timestamp(), colaborador_id=?, pago_id=?
            WHERE id=?;`,
            [
              colaborador_id == null
                ? response_search.result[0].colaborador_id
                : colaborador_id,
              pago_id == null ? response_search.result[0].pago_id : pago_id,
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
        return res.status(200).json({ log: "VALIDACIÓN PAGO NO ENCONTRADA" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateValidacionPago,
};
