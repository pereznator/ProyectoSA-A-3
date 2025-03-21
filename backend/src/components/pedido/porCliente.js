const query = require("../../helpers/database/mysql/operation/query");

const readPedidoPorCliente = async (req, res) => {
  const { idCliente } = req.params;
  query
    .query(
      `    
      SELECT 
          pedido.id,
          DATE_FORMAT(pedido.fecha_registro,"%d/%m/%Y %r") AS fecha_registro,
          DATE_FORMAT(pedido.fecha_update,"%d/%m/%Y %r") AS fecha_update,
          CONVERT(pedido.correlativo, CHAR) as correlativo,
          pedido.estado_pedido_id,
          pedido.oferta_id,
          pedido.cliente_id,
          CONVERT(p.detalle, CHAR) AS detalle_pago,
          mp.tipo_metodo_pago_id,
          CONVERT(dt.numero_tarjeta, CHAR) AS numero_tarjeta,
          dt.fecha_exp,
          tmp.descripcion AS tipo_metodo_pago
      FROM proyecto.pedido
      INNER JOIN proyecto.pago p ON p.pedido_id = pedido.id
      INNER JOIN proyecto.metodo_pago mp ON mp.id = p.metodo_pago_id
      INNER JOIN proyecto.tipo_metodo_pago tmp ON tmp.id = mp.tipo_metodo_pago_id
      LEFT JOIN proyecto.detalle_tarjeta dt ON dt.id = mp.detalle_tarjeta_id
      WHERE pedido.cliente_id = ${idCliente};
    `
    )
    .then((res_pedidos) => {

      const pedidosIds = res_pedidos.result.map(pedido => pedido.id);
      if (pedidosIds.length === 0) {
        return res.status(200).json({ response_database: [] });
      }
      query.query(
        `SELECT dp.cantidad, CONVERT(p.nombre, CHAR) AS nombre, p.precio, dp.pedido_id FROM proyecto.detalle_pedido dp JOIN proyecto.producto p ON p.id = dp.producto_id WHERE dp.pedido_id IN (${pedidosIds.join(",")})`
      ).then(res_detalles => {

        const detalles = res_detalles.result;

        const pedidos = res_pedidos.result.map(pedido => {
          const detallesPedido = detalles.filter(detalle => detalle.pedido_id === pedido.id);
          pedido["detalles"] = detallesPedido;
          return pedido;
        });
        
        return res.status(200).json({ response_database: pedidos })
      }).catch(error => {
        console.log(error);
        return res.status(500).json({ log: error });
      });

    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  readPedidoPorCliente,
};
