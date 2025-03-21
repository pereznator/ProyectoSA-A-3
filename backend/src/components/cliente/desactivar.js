const view_on_cognito = require("../../helpers/cognito/view");
const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const desactivarCliente = async (req, res) => {
  const { username } = req.params;
  view_on_cognito.getUserAttributesByUsername(username).then((response) => {
    const sub = response.sub;
    query_format.queryFormat(`UPDATE proyecto.usuario SET estado_usuario_id = 2 WHERE cognito_sub = ?`, [sub]).then(result => {
      return res.status(200).json({response});
    }).catch(error => {
      return res.status(500).json({ log: error });
    });
  }).catch((error) => {
    return res.status(500).json({ log: error });
  });
};

module.exports = { desactivarCliente };
