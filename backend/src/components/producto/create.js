const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const createProducto = async (req, res) => {
  const { nombre, descripcion, portada, precio, categoria_producto_id, proveedor_id, costo } = req.body;
  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.producto
      (nombre, descripcion, portada, precio, categoria_producto_id, proveedor_id, costo)
      VALUES(?, ?, ?, ?, ?, ?, ?);`,
      [nombre, descripcion, portada, precio, categoria_producto_id, proveedor_id, costo]
    )
    .then((response_database) => {
      return res.status(200).json({response_database});
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  createProducto,
};
