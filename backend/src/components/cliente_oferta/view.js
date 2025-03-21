const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const viewClienteOferta = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
      SELECT 
          id,
          CONVERT(correlativo, CHAR) as correlativo,
          cliente_oferta.fecha_registro,
          cliente_oferta.fecha_update,
          DATE_FORMAT(cliente_oferta.fecha_registro,"%d/%m/%Y %r") AS fechaRegistro,
          DATE_FORMAT(cliente_oferta.fecha_update,"%d/%m/%Y %r") AS fechaUpdate,
          oferta_id,
          cliente_id
      FROM proyecto.cliente_oferta;
      where cliente_oferta.id = ?
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        return res.status(200).json({
          response_database,
        });
      } else {
        return res.status(200).json({ log: "CLIENTE OFERTA NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewClienteOferta,
};
