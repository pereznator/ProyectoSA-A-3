const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const deleteEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormatWithTransaction(
      `DELETE FROM proyecto.estado_usuario
      WHERE id=?`,
      [id]
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
  deleteEstadoUsuario,
};
