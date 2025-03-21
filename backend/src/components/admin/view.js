const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const view_on_cognito = require("../../helpers/cognito/view");
const viewAdmin = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
        SELECT 
          usuario.fecha_registro,
          usuario.fecha_update,
          DATE_FORMAT(usuario.fecha_registro,"%d/%m/%Y %r") AS fechaRegistro, 
          DATE_FORMAT(usuario.fecha_update,"%d/%m/%Y %r") AS fechaUpdate,
          usuario.id,
          CONVERT(cognito_sub,CHAR) AS cognito_sub,         
          estado_usuario.descripcion as estado_usuario
        FROM proyecto.usuario
        inner join estado_usuario on usuario.estado_usuario_id = estado_usuario.id
        WHERE usuario.id = ?
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        view_on_cognito
          .getUserAttributesBySub(response_database.result[0].cognito_sub)
          .then((response_cognito) => {
            return res.status(200).json({
              response_database,
              response_cognito,
            });
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
  viewAdmin,
};
