const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const { v4 } = require("uuid");

const createPedido = async (req, res) => {
  const { estado_pedido_id, oferta_id, cliente_id, detalle_pedido } = req.body;
  console.log("[detalle pedido]", detalle_pedido);

  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.pedido
      ( fecha_registro, fecha_update, correlativo, estado_pedido_id, oferta_id, cliente_id)
      VALUES( current_timestamp(), current_timestamp(), ?, ?, ?, ?);`,
      [v4(), estado_pedido_id, oferta_id, cliente_id]
    )
    .then((response_pedido) => {
      let querys = [];
      detalle_pedido
        .map((actual, indice) => {
          querys.push({
            query: `INSERT INTO proyecto.detalle_pedido
        ( cantidad, pedido_id, producto_id)
        VALUES( ?,?,?);`,
            inserts: [
              actual.cantidad,
              response_pedido.result.insertId,
              actual.producto_id,
            ],
          });
          querys.push({
            query: `update existencia set estado_existencia_id = 2 where producto_id = ? and estado_existencia_id = 1 order by id desc limit ?`,
            inserts: [actual.producto_id, actual.cantidad],
          });
          if (indice == detalle_pedido.length - 1) {
            query_format
              .queryFormatWithTransactionArray(querys)
              .then((response_database) => {
                return res
                  .status(200)
                  .json({ response_pedido, response_database });
              })
              .catch((error) => {
                console.log(error);
                return res.status(500).json({ log: error });
              });
          }
        })
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  createPedido,
};
