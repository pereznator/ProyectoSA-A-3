const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateDetallePedido = async (req, res) => {
  const { id } = req.params;
  const {cantidad, pedido_id, producto_id } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT 
        cantidad,
        pedido_id,
        producto_id
      FROM proyecto.detalle_pedido 
      where id = ?
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
            UPDATE proyecto.detalle_pedido
            SET fecha_update=current_timestamp(), cantidad=?, pedido_id=?, producto_id=?
            WHERE id=?;`,
            [
              cantidad == null ? response_search.result[0].cantidad : cantidad,
              pedido_id == null
                ? response_search.result[0].pedido_id
                : pedido_id,
              producto_id == null
                ? response_search.result[0].producto_id
                : producto_id,
              id,
            ]
          )
          .then(async (response_database) => {
            return res.status(200).json({ response_database });
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({ log: error });
          });
      } else {
        return res.status(200).json({ log: "DETALLE PEDIDO NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateDetallePedido,
};
