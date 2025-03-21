const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const view_on_cognito = require("../../helpers/cognito/view");
const viewCliente = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
        SELECT 
            cliente.id,
            CONVERT(nombre,CHAR) AS nombre,
            CONVERT(apellido,CHAR) AS apellido,
            CONVERT(fotografia,CHAR) AS fotografia,
            celular,
            usuario_id,
            cliente.fecha_registro,
            cliente.fecha_update,
            DATE_FORMAT(cliente.fecha_registro,"%d/%m/%Y %r") AS fechaRegistro, 
            DATE_FORMAT(cliente.fecha_update,"%d/%m/%Y %r") AS fechaUpdate,
            CONVERT(usuario.cognito_sub, char) as cognito_sub, 
            estado_usuario.descripcion as estado_usuario, 
            CONVERT(direccion_entrega, CHAR) AS direccion_entrega,
            usuario.estado_usuario_id      
        FROM proyecto.cliente
          inner join usuario on cliente.usuario_id = usuario.id
          inner join estado_usuario on usuario.estado_usuario_id = estado_usuario.id
          inner join tipo_usuario on usuario.tipo_usuario_id = tipo_usuario.id
        where cliente.id = ? 
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
        return res.status(200).json({ log: "CLIENTE NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewCliente,
};
