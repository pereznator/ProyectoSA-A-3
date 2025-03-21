const query_format = require("../database/mysql/operation/queryFormat");
const getUsr = async (req, res) => {
  query_format
    .queryFormat(
      `    
    SELECT 

        IFNULL((select cliente.id from cliente where cliente.usuario_id = (select usuario.id from usuario where usuario.cognito_sub = ?)),0) as id_cliente,
        IFNULL((select colaborador.id from colaborador where colaborador.usuario_id = (select usuario.id from usuario where usuario.cognito_sub = ?)),0) as id_colaborador,
        DATE_FORMAT(usuario.fecha_registro,"%d/%m/%Y %r") AS fechaRegistro, 
        DATE_FORMAT(usuario.fecha_update,"%d/%m/%Y %r") AS fechaUpdate,
        usuario.id as id_usr,
        CONVERT(cognito_sub,CHAR) AS cognito_sub,         
        estado_usuario.descripcion as estado_usuario,
        tipo_usuario.descripcion as tipo_usuario,
        IFNULL((select cliente.carrito_id from cliente where cliente.usuario_id = (select usuario.id from usuario where usuario.cognito_sub = ?)),0) as carrito_id
    FROM proyecto.usuario
    inner join estado_usuario on usuario.estado_usuario_id = estado_usuario.id
    inner join tipo_usuario on usuario.tipo_usuario_id = tipo_usuario.id
    WHERE usuario.cognito_sub = ?
  
  `,
      [req.userData.sub, req.userData.sub, req.userData.sub, req.userData.sub]
    )
    .then((response_database) => {
      return res
        .status(200)
        .json({ database: response_database.result[0], cognito: req.userData });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json(error);
    });
};
module.exports = {
  getUsr,
};
