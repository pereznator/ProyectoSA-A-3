const query = require("../../helpers/database/mysql/operation/query");

const readAdmin = async (req, res) => {
  query
    .query(
      `    
    SELECT 
          usuario.id,
          DATE_FORMAT(usuario.fecha_registro,"%d/%m/%Y %r") AS fecha_registro, 
          DATE_FORMAT(usuario.fecha_update,"%d/%m/%Y %r") AS fecha_update,
          CONVERT(cognito_sub,CHAR) AS cognito_sub,         
          estado_usuario.descripcion as estado_usuario
    FROM proyecto.usuario
    inner join estado_usuario on usuario.estado_usuario_id = estado_usuario.id
    WHERE usuario.tipo_usuario_id = 1
    `
    )
    .then((response_database) => {
      return res.status(200).json({
        response_database,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  readAdmin,
};
