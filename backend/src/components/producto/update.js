const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateProducto = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    portada,
    precio,
    categoria_producto_id,
    proveedor_id,
    costo,
  } = req.body;
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
          CONVERT(categoria_producto.descripcion, CHAR) as categoria_producto
    FROM proyecto.producto
    INNER JOIN categoria_producto on producto.categoria_producto_id = categoria_producto.id
    INNER JOIN proveedor on producto.proveedor_id = proveedor.id
    WHERE producto.id = ?;
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
            UPDATE proyecto.producto
            SET 
                nombre=?,
                descripcion=?,
                portada=?,
                precio=?,
                fecha_update=current_timestamp(),
                categoria_producto_id=?,
                proveedor_id=?,
                costo=?
            WHERE id=?;`,
            [
              nombre == null ? response_search.result[0].nombre : nombre,
              descripcion == null
                ? response_search.result[0].descripcion
                : descripcion,
              portada == null ? response_search.result[0].portada : portada,
              precio == null ? response_search.result[0].precio : precio,
              categoria_producto_id == null
                ? response_search.result[0].categoria_producto_id
                : categoria_producto_id,
              proveedor_id == null
                ? response_search.result[0].proveedor_id
                : proveedor_id,
              costo == null ? response_search.result[0].costo : costo,
              id,
            ]
          )
          .then(async (response_database) => {
            return res.status(200).json({ response_database });
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({ log: error });
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
  updateProducto,
};
