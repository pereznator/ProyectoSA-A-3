const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updatePago = async (req, res) => {
  const { id } = req.params;
  const { detalle, pedido_id, metodo_pago_id } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT 
          id,
          CONVERT(detalle, CHAR) as detalle,
          pedido_id,
          metodo_pago_id
      FROM proyecto.pago;
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
            UPDATE proyecto.pago
              SET detalle=?, fecha_update=current_timestamp(), pedido_id=?, metodo_pago_id=?
            WHERE id=?;`,
            [
              detalle == null ? response_search.result[0].detalle : detalle,
              pedido_id == null
                ? response_search.result[0].pedido_id
                : pedido_id,
              metodo_pago_id == null
                ? response_search.result[0].metodo_pago_id
                : metodo_pago_id,
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
        return res.status(200).json({ log: "PAGO NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updatePago,
};
