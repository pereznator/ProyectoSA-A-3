const query = require("../../helpers/database/mysql/operation/query");

const readPago = async (req, res) => {
  query
    .query(
      `    
      SELECT 
          id,
          CONVERT(detalle, CHAR) as detalle,
          DATE_FORMAT(fecha_registro, "%d/%m/%Y %r") as fecha_registro,
          DATE_FORMAT(fecha_update, "%d/%m/%Y %r") as fecha_update,
          pedido_id,
          metodo_pago_id
      FROM proyecto.pago;
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
  readPago,
};
