const query = require("../../helpers/database/mysql/operation/query");

const readIngreso = async (req, res) => {
  query
    .query(
      `    
      SELECT 
        ingreso.id, 
        DATE_FORMAT(ingreso.fecha_registro,"%d/%m/%Y %r") AS fecha_registro, 
        DATE_FORMAT(ingreso.fecha_update,"%d/%m/%Y %r") AS fecha_update,
        CONVERT(correlativo, CHAR) as correlativo,
        monto, 
        validacion_pago_id
      FROM proyecto.ingreso
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
  readIngreso,
};
