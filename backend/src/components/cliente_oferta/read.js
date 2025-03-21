const query = require("../../helpers/database/mysql/operation/query");

const readClienteOferta = async (req, res) => {
  query
    .query(
      `    
      SELECT 
          id,
          CONVERT(correlativo, CHAR) as correlativo,
          DATE_FORMAT(fecha_registro,"%d/%m/%Y %r") AS fecha_registro,
          DATE_FORMAT(fecha_update,"%d/%m/%Y %r") AS fecha_update,
          oferta_id,
          cliente_id
      FROM proyecto.cliente_oferta;
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
  readClienteOferta,
};
