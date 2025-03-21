const query = require("../../helpers/database/mysql/operation/query");

const readDetallePedido = async (req, res) => {
  query
    .query(
      `    
      SELECT 
          id,
          DATE_FORMAT(fecha_registro, "%d/%m/%Y %r") as fecha_registro,
          DATE_FORMAT(fecha_update, "%d/%m/%Y %r") as fecha_update,
          cantidad,
          pedido_id,
          producto_id
    FROM proyecto.detalle_pedido;
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
  readDetallePedido,
};
