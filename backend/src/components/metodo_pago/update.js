const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateMetodoPago = async (req, res) => {
  const { id } = req.params;
  const {tipo_metodo_pago_id, cliente_id, detalle_tarjeta_id } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT 
        id, 
        tipo_metodo_pago_id,
        cliente_id,
        detalle_tarjeta_id
      FROM proyecto.metodo_pago
      WHERE id = ?;
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
            UPDATE proyecto.metodo_pago
            SET tipo_metodo_pago_id=?, cliente_id=?, detalle_tarjeta_id=?, fecha_update=current_timestamp()
            WHERE id=?;`,
            [
              tipo_metodo_pago_id == null ? response_search.result[0].tipo_metodo_pago_id : tipo_metodo_pago_id,
              cliente_id == null
                ? response_search.result[0].cliente_id
                : cliente_id,
              detalle_tarjeta_id == null
                ? response_search.result[0].detalle_tarjeta_id
                : detalle_tarjeta_id,
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
        return res.status(200).json({ log: "METODO DE PAGO NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateMetodoPago,
};
