const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const checkUsr = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormatWithTransaction(
      `        
      UPDATE proyecto.usuario
        SET fecha_update=current_timestamp(), estado_usuario_id=1
      WHERE id=cognito_sub=?;     
        `,
      [id]
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
  checkUsr,
};
