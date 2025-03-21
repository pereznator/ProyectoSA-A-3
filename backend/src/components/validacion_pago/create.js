const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const { v4 } = require("uuid");

const createValidacionPago = async (req, res) => {
  const { colaborador_id, pago_id } = req.body;

  console.log("colaboradorId", colaborador_id);

  let query_array = [
    {
      query: `
      INSERT INTO proyecto.validacion_pago
      ( fecha_registro, fecha_update, colaborador_id, pago_id)
      VALUES( current_timestamp(), current_timestamp(), ?, ?);`,
      inserts: [colaborador_id, pago_id],
    },
    {
      query: `
      INSERT INTO proyecto.ingreso (fecha_registro, fecha_update, correlativo, monto, validacion_pago_id)
      VALUES(current_timestamp(), current_timestamp(), ?,(select 
              sum(subtotal) - AVG(descuento) as total 
            from 
            (
              select 
                detalle_pedido.cantidad*producto.precio as subtotal, 
                ifnull(oferta.monto,0) as descuento  
              from detalle_pedido 
              inner join pedido on detalle_pedido.pedido_id = pedido.id 
              inner join producto on detalle_pedido.producto_id = producto.id 
              LEFT JOIN oferta on pedido.oferta_id  = oferta.id 
              where detalle_pedido.pedido_id = 
              (
                select 
                  pedido.id 
                from pago 
                inner join pedido on pago.pedido_id = pedido.id where pago.id = ?
              )
            ) b), LAST_INSERT_ID());`,
      inserts: [v4(), pago_id],
    },
  ];
  query_format
    .queryFormatWithTransactionArray(query_array)
    .then((response_database) => {
      return res.status(200).json({ response_database });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  createValidacionPago,
};
