const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const readMetodoPago = async (req, res) => {
  const { id_cliente } = req.query;
  console.log("params",id_cliente);
  query_format
    .queryFormat(
      `    
      SELECT 
        mp.id, 
        mp.tipo_metodo_pago_id,
        mp.cliente_id,
        mp.detalle_tarjeta_id,
        DATE_FORMAT(mp.fecha_registro, "%d/%m/%Y %r") as fecha_registro,
        DATE_FORMAT(mp.fecha_update, "%d/%m/%Y %r") as fecha_update,
        tmp.descripcion AS tipo_metodo_pago,
        CONVERT(dt.numero_tarjeta, CHAR) AS numero_tarjeta,
        dt.fecha_exp
      FROM proyecto.metodo_pago mp
      INNER JOIN tipo_metodo_pago tmp ON tmp.id = mp.tipo_metodo_pago_id
      LEFT JOIN detalle_tarjeta dt ON dt.id = mp.detalle_tarjeta_id
      WHERE mp.cliente_id = ?;
    `, [id_cliente]
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
  readMetodoPago,
};
