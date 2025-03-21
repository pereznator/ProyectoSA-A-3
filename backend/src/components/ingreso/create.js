const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const { v4 } = require("uuid");

const createIngreso = async (req, res) => {
  const { monto, validacion_pago_id } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.ingreso
      ( correlativo, monto, validacion_pago_id)
      VALUES(?,?,?);`,
      [v4(), monto, validacion_pago_id]
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
  createIngreso,
};
