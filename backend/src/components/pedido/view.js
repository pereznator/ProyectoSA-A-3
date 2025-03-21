const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const viewPedido = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
      SELECT 
          id,
          fecha_registro,
          fecha_update,
          DATE_FORMAT(pedido.fecha_registro,"%d/%m/%Y %r") AS fechaRegistro,
          DATE_FORMAT(pedido.fecha_update,"%d/%m/%Y %r") AS fechaUpdate,
          CONVERT(pedido.correlativo, CHAR) AS correlativo,
          estado_pedido_id,
          oferta_id,
          cliente_id
      FROM proyecto.pedido
      where pedido.id = ?
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        query_format.queryFormat(`
        SELECT
          dp.id AS detalle_pedido_id,
          dp.cantidad,
          CONVERT(p.nombre, CHAR) AS nombre,
          p.precio
        FROM detalle_pedido dp
        INNER JOIN producto p ON p.id = dp.producto_id
        WHERE dp.pedido_id = ${id}
        `).then(response_detalle => {
          const pedido = response_database.result[0];
          pedido["detalles"] = response_detalle.result;
          return res.status(200).json({pedido});
        }).catch(error => {
          console.log(error);
          return res.status(500).json({ log: error });
        })
      } else {
        return res.status(200).json({ log: "PEDIDO NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewPedido,
};
