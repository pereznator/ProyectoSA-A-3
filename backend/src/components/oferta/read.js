const query = require("../../helpers/database/mysql/operation/query");

const readOferta = async (req, res) => {
  const { estado_oferta_id } = req.query;
  query
    .query(
      `    
      SELECT 
        oferta.id,
        CONVERT(oferta.descripcion, CHAR) AS descripcion,
        oferta.monto,
        DATE_FORMAT(oferta.fecha_vencimiento,"%d/%m/%Y %r") AS fecha_vencimiento,
        DATE_FORMAT(oferta.fecha_registro,"%d/%m/%Y %r") AS fecha_registro,
        DATE_FORMAT( oferta.fecha_update,"%d/%m/%Y %r") AS fecha_update,      
        oferta.producto_id,
        oferta.estado_oferta_id,
        CONVERT(estado_oferta.descripcion, CHAR) as estado_oferta,
        CONVERT(producto.nombre, CHAR) as producto,
        CONVERT(producto.portada, CHAR) AS portada
      FROM proyecto.oferta
      INNER JOIN estado_oferta on oferta.estado_oferta_id = estado_oferta.id
      INNER JOIN producto on oferta.producto_id = producto.id
      ${estado_oferta_id ? `WHERE oferta.estado_oferta_id = ${estado_oferta_id}` : ""}
      ;
    `
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
  readOferta,
};
