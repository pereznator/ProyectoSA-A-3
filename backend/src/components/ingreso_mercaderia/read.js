const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const readIngresoMercaderia = async (req, res) => {
  const { idProducto } = req.params;
  query_format
    .queryFormat(
      `    
      SELECT im.id, 
             CONVERT(im.correlativo, CHAR) as correlativo,
             DATE_FORMAT(im.fecha_registro,"%d/%m/%Y %r") AS fecha_registro, 
             DATE_FORMAT(im.fecha_update,"%d/%m/%Y %r") AS fecha_update,
             eg.monto,
             COUNT(e.id) AS "cantidad"
      FROM proyecto.ingreso_mercaderia im
      INNER JOIN proyecto.existencia e ON e.ingreso_mercaderia_id = im.id
      INNER JOIN proyecto.egreso eg ON eg.ingreso_mercaderia_id = im.id
      WHERE e.producto_id = ?
      GROUP BY (im.id)
      ;
    `, [idProducto]
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
  readIngresoMercaderia,
};
