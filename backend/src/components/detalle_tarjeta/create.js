const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const createDetalleTarjeta = async (req, res) => {
  const { numero_tarjeta, cvv, fecha_exp } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.detalle_tarjeta
      ( numero_tarjeta, cvv, fecha_exp, fecha_registro, fecha_update)
      VALUES( ?, ?, ?, current_timestamp(), current_timestamp());`,
      [numero_tarjeta, cvv, fecha_exp]
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
  createDetalleTarjeta,
};
