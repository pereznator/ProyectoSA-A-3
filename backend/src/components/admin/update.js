const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const update_on_cognito = require("../../helpers/cognito/update");
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, email, estado_usuario_id } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT 
        usuario.id,
        CONVERT(cognito_sub,CHAR) AS cognito_sub,         
        estado_usuario.descripcion as estado_usuario
      FROM proyecto.usuario
      inner join estado_usuario on usuario.estado_usuario_id = estado_usuario.id
      WHERE usuario.id = ?
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        let query_array = [];

        query_array.push({
          query: `UPDATE proyecto.usuario
          SET fecha_update=current_timestamp(), estado_usuario_id=?
          WHERE id=?;`,
          inserts: [
            estado_usuario_id != null
              ? estado_usuario_id
              : response_search.result[0].estado_usuario_id,
            id,
          ],
        });

        query_format
          .queryFormatWithTransactionArray(query_array)
          .then(async (response_database) => {
            if (email != null && username) {
              update_on_cognito
                .update({
                  username: username,
                  email: email,
                })
                .then((response_cognito) => {
                  return res
                    .status(200)
                    .json({ response_database, response_cognito });
                })
                .catch((error) => {
                  console.log(error);
                  return res.status(500).json({ log: error });
                });
            } else {
              return res.status(200).json({ response_database });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({ log: error });
          });
      } else {
        return res.status(200).json({ log: "ADMIN NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateAdmin,
};
