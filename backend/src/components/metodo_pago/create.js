const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const createMetodoPago = async (req, res) => {
  const { tipo_metodo_pago_id, cliente_id, detalle_tarjeta_id } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.metodo_pago
      ( tipo_metodo_pago_id, cliente_id, detalle_tarjeta_id, fecha_registro, fecha_update)
      VALUES( ?, ?, ?, current_timestamp(), current_timestamp());`,
      [tipo_metodo_pago_id, cliente_id, detalle_tarjeta_id]
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
  createMetodoPago,
};
