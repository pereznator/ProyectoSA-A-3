const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const { v4 } = require("uuid");

const createExistencia = async (req, res) => {
  const { producto_id, estado_existencia_id, ingreso_mercaderia_id } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.existencia
      (correlativo, producto_id, estado_existencia_id, ingreso_mercaderia_id)
      VALUES(?, ?, ?, ?);`,
      [v4(), producto_id, estado_existencia_id, ingreso_mercaderia_id]
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
  createExistencia,
};
