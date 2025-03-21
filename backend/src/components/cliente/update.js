const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const update_on_cognito = require("../../helpers/cognito/update");
const updateCliente = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido,
    fotografia,
    celular,
    direccion_entrega,
    username,
    email,
    estado_usuario_id,
  } = req.body;
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
          CONVERT(direccion_entrega, CHAR) AS direccion_entrega,
          usuario.estado_usuario_id      
      FROM proyecto.cliente
        inner join usuario on cliente.usuario_id = usuario.id
      where cliente.id = ?        
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        let query_array = [];
        query_array.push({
          query: `UPDATE proyecto.cliente
          SET nombre=?, apellido=?, fotografia=?, celular=?, fecha_update=current_timestamp(), direccion_entrega=?
          WHERE id=?;`,
          inserts: [
            nombre != null ? nombre : response_search.result[0].nombre,
            apellido != null ? apellido : response_search.result[0].apellido,
            fotografia != null
              ? fotografia
              : response_search.result[0].fotografia,
            celular != null ? celular : response_search.result[0].celular,
            direccion_entrega != null
              ? direccion_entrega
              : response_search.result[0].direccion_entrega,
            id,
          ],
        });
        if (estado_usuario_id != null) {
          query_array.push({
            query: `UPDATE proyecto.usuario
          SET fecha_update=current_timestamp(), estado_usuario_id=?
          WHERE id=?;`,
            inserts: [
              estado_usuario_id != null
                ? estado_usuario_id
                : response_search.result[0].estado_usuario_id,
              response_search.result[0].usuario_id,
            ],
          });
        }
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
        return res.status(200).json({ log: "CLIENTE NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateCliente,
};
