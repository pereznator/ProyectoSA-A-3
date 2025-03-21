const query = require("../../helpers/database/mysql/operation/query");

const readDetalleTarjeta = async (req, res) => {
  query
    .query(
      `    
      SELECT 
        id,
        CONVERT(numero_tarjeta, CHAR) AS numero_tarjeta,
        cvv,        
        DATE_FORMAT(fecha_exp,"%d/%m/%Y %r") AS fecha_exp,        
        DATE_FORMAT(fecha_registro,"%d/%m/%Y %r") AS fecha_registro,
        DATE_FORMAT(fecha_update,"%d/%m/%Y %r") AS fecha_update   
      FROM proyecto.detalle_tarjeta;
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
  readDetalleTarjeta,
};
