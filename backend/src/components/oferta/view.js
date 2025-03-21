const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const viewOferta = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
      SELECT 
        oferta.id,
        oferta.descripcion,
        oferta.monto,
        fecha_vencimiento,
        fecha_registro,
        fecha_update,      
        DATE_FORMAT(oferta.fecha_vencimiento,"%d/%m/%Y %r") AS fechaVencimiento,
        DATE_FORMAT(oferta.fecha_registro,"%d/%m/%Y %r") AS fecha_Registro,
        DATE_FORMAT( oferta.fecha_update,"%d/%m/%Y %r") AS fechaUpdate,      
        oferta.producto_id,
        oferta.estado_oferta_id,
        CONVERT(estado_oferta.descripcion, CHAR) as estado_oferta,
        CONVERT(producto.nombre, CHAR) as producto
      FROM proyecto.oferta
      INNER JOIN estado_oferta on oferta.estado_oferta_id = estado_oferta.id
      INNER JOIN producto on oferta.producto_id = producto.id
      WHERE oferta.id = ?;
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        return res.status(200).json({
          response_database,
        });
      } else {
        return res.status(200).json({ log: "OFERTA NO ENCONTRADA" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewOferta,
};
