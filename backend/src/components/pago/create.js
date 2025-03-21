const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const createPago = async (req, res) => {
  const { detalle, pedido_id, metodo_pago_id } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.pago
      ( detalle, fecha_registro, fecha_update, pedido_id, metodo_pago_id)
      VALUES(?, current_timestamp(), current_timestamp(), ?, ?);`,
      [detalle, pedido_id, metodo_pago_id ]
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
  createPago,
};
