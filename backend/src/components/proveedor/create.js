const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const createProveedor = async (req, res) => {
  const { nombre } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.proveedor
        ( nombre, fecha_registro, fecha_update)
        VALUES(?, current_timestamp(), current_timestamp());`,
      [nombre]
    )
    .then((response_database) => {
      return res.status(200).json({response_database});
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  createProveedor,
};
