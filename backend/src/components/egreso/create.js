const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const { v4 } = require("uuid");

const createEgreso = async (req, res) => {
  const { monto, ingreso_mercaderia_id } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.egreso
      ( correlativo, monto, ingreso_mercaderia_id)
      VALUES(?,?,?);`,
      [v4(), monto, ingreso_mercaderia_id]
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
  createEgreso,
};
