const query = require("../../helpers/database/mysql/operation/query");

const readCliente = async (req, res) => {
  query
    .query(
      `    
    SELECT 
      cliente.id,
      CONVERT(nombre,CHAR) AS nombre,
      CONVERT(apellido,CHAR) AS apellido,
      CONVERT(fotografia,CHAR) AS fotografia,
      celular,
      usuario_id,
      DATE_FORMAT(fecha_registro,"%d/%m/%Y %r") AS fecha_registro, 
      DATE_FORMAT(fecha_update,"%d/%m/%Y %r") AS fecha_update,
      CONVERT(direccion_entrega, CHAR) AS direccion_entrega
    FROM proyecto.cliente;
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
  readCliente,
};
