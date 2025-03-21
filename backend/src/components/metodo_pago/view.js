const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const viewMetodoPago = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
      SELECT 
        id, 
        tipo_metodo_pago_id,
        cliente_id,
        detalle_tarjeta_id,
        fecha_registro,
        fecha_update,
        DATE_FORMAT(fecha_registro, "%d/%m/%Y %r") as fechaRegistro,
        DATE_FORMAT(fecha_update, "%d/%m/%Y %r") as fechaUpdate
       FROM proyecto.metodo_pago
       WHERE id = ?;
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        return res.status(200).json({
          response_database,
        });
      } else {
        return res.status(200).json({ log: "METODO DE PAGO NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewMetodoPago,
};
