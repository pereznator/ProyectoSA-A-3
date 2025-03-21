const query = require("../../helpers/database/mysql/operation/query");

const readTipoUsuario = async (req, res) => {
  query
    .query(
      `    
      SELECT id, 
             descripcion,     
             DATE_FORMAT(fecha_registro,"%d/%m/%Y %r") AS fecha_registro, 
             DATE_FORMAT(fecha_update,"%d/%m/%Y %r") AS fecha_update,
      FROM proyecto.tipo_usuario;
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
  readTipoUsuario,
};
