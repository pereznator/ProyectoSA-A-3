const query = require("../../helpers/database/mysql/operation/query");

const readExistencia = async (req, res) => {
  query
    .query(
      `    
      SELECT 
        existencia.id,
        CONVERT(existencia.correlativo, CHAR) as correlativo,
        DATE_FORMAT(existencia.fecha_registro,"%d/%m/%Y %r") AS fecha_registro,
        DATE_FORMAT(existencia.fecha_update,"%d/%m/%Y %r") AS fecha_update,
        existencia.producto_id,
        existencia.estado_existencia_id,
        existencia.ingreso_mercaderia_id,
        CONVERT(producto.nombre, CHAR) as producto, 
        CONVERT(estado_existencia.descripcion, CHAR) as estado_existencia,
        CONVERT(ingreso_mercaderia.correlativo, CHAR) as ingreso_mercaderia
      FROM proyecto.existencia
      INNER JOIN producto on existencia.producto_id = producto.id
      INNER JOIN estado_existencia on existencia.estado_existencia_id = estado_existencia.id
      INNER JOIN ingreso_mercaderia on existencia.ingreso_mercaderia_id = ingreso_mercaderia.id;
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
  readExistencia,
};
