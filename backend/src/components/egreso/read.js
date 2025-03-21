const query = require("../../helpers/database/mysql/operation/query");

const readEgreso = async (req, res) => {
  query
    .query(
      `    
      SELECT 
        egreso.id, 
        DATE_FORMAT(egreso.fecha_registro,"%d/%m/%Y %r") AS fecha_registro, 
        DATE_FORMAT(egreso.fecha_update,"%d/%m/%Y %r") AS fecha_update,
        CONVERT(correlativo, CHAR) as correlativo,
        monto, 
        ingreso_mercaderia_id,
        CONVERT(ingreso_mercaderia.correlativo, CHAR) as ingreso_mercaderia
      FROM proyecto.egreso
      inner join ingreso_mercaderia on egreso.ingreso_mercaderia_id = ingreso_mercaderia.id
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
  readEgreso,
};
