const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const viewPago = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
      SELECT 
        id,
        CONVERT(detalle, CHAR) as detalle,
        fecha_registro,
        fecha_update,
        DATE_FORMAT(fecha_registro, "%d/%m/%Y %r") as fechaRegistro,
        DATE_FORMAT(fecha_update, "%d/%m/%Y %r") as fechaUpdate,
        pedido_id,
        metodo_pago_id
      FROM proyecto.pago;
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        return res.status(200).json({
          response_database,
        });
      } else {
        return res.status(200).json({ log: "PAGO NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewPago,
};
