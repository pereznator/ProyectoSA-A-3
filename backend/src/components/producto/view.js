const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const viewProducto = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
      SELECT 
            producto.id, 
            CONVERT(producto.nombre,CHAR) AS nombre,
            CONVERT(producto.descripcion,CHAR) AS descripcion,
            CONVERT(portada,CHAR) AS portada,
            precio,
            DATE_FORMAT(producto.fecha_registro,"%d/%m/%Y %r") AS fechaRegistro, 
            DATE_FORMAT(producto.fecha_update,"%d/%m/%Y %r") AS fechaUpdate,
            producto.fecha_registro,
            producto.fecha_update,
            categoria_producto_id,
            proveedor_id,            
            costo,
            CONVERT(proveedor.nombre, CHAR) as proveedor,
            CONVERT(categoria_producto.descripcion, CHAR) as categoria_producto,
            COUNT(e.id) AS en_existencia
      FROM proyecto.producto
      INNER JOIN categoria_producto on producto.categoria_producto_id = categoria_producto.id
      INNER JOIN proveedor on producto.proveedor_id = proveedor.id
      LEFT JOIN existencia e ON e.producto_id = producto.id and e.estado_existencia_id = 1
      LEFT JOIN oferta o ON o.producto_id = producto.id
      WHERE producto.id = ?;
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        return res.status(200).json({
          response_database,
        });
      } else {
        return res.status(200).json({ log: "PRODUCTO NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewProducto,
};
