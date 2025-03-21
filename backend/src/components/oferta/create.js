const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const createOferta = async (req, res) => {
  const {
    descripcion,
    monto,
    fecha_vencimiento,
    producto_id,
    estado_oferta_id,
  } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.oferta
      ( descripcion, monto, fecha_vencimiento, producto_id, estado_oferta_id)
      VALUES( ?,?,?,?,?);`,
      [descripcion, monto, fecha_vencimiento, producto_id, estado_oferta_id]
    )
    .then((response_database) => {
      return res.status(200).json({ response_database });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  createOferta,
};
