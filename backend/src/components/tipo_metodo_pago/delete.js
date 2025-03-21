const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const deleteTipoMetodoPago = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormatWithTransaction(
      `DELETE FROM proyecto.tipo_metodo_pago
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
  deleteTipoMetodoPago,
};
