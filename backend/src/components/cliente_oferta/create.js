const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const { v4 } = require("uuid");

const createClienteOferta = async (req, res) => {
  const { oferta_id, cliente_id } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.cliente_oferta
      ( correlativo, fecha_registro, fecha_update, oferta_id, cliente_id)
      VALUES(?, current_timestamp(), current_timestamp(), ?, ?);`,
      [v4(), oferta_id, cliente_id]
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
  createClienteOferta,
};
