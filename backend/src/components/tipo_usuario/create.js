const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const createTipoUsuario = async (req, res) => {
  const { descripcion } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.tipo_usuario
        ( descripcion, fecha_registro, fecha_update)
        VALUES(?, current_timestamp(), current_timestamp());`,
      [descripcion]
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
  createTipoUsuario,
};
