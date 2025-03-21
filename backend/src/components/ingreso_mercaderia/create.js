const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const { v4 } = require("uuid");
const createIngresoMercaderia = async (req, res) => {
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.ingreso_mercaderia
        ( correlativo, fecha_registro, fecha_update)
        VALUES(?, current_timestamp(), current_timestamp());`,
      [v4()]
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
  createIngresoMercaderia,
};
