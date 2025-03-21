const delete_on_cognito = require("../../helpers/cognito/delete");
const view_on_cognito = require("../../helpers/cognito/view");
const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const deleteCliente = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormatWithTransactionArray([
      {
        query: `select convert(cognito_sub, char) as cognito_sub from usuario where id = (select usuario_id from cliente where id = ?)`,
        inserts: [id],
      },
      {
        query: `DELETE FROM usuario
        WHERE usuario.id=(select usuario_id from cliente where cliente.id = ?)`,
        inserts: [id],
      },
    ])
    .then((response_database) => {
      view_on_cognito
        .getUserAttributesBySub(response_database.results[0][0].cognito_sub)
        .then((cognito_info) => {
          delete_on_cognito
            .delete_cognito(cognito_info.Username)
            .then((response_cognito) => {
              return res.status(200).json({
                cognito: response_cognito,
                database: response_database,
              });
            })
            .catch((error) => {
              console.log(error);
              return res.status(500).json({ log: error });
            });
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ log: error });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  deleteCliente,
};
