const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const viewProveedor = async (req, res) => {
  const { id } = req.params;
  query_format
    .queryFormat(
      `
        SELECT 
              id, 
              CONVERT(nombre, CHAR) AS nombre,
              fecha_registro, 
              fecha_update,
              DATE_FORMAT(fecha_registro,"%d/%m/%Y %r") AS fechaRegistro, 
              DATE_FORMAT(fecha_update,"%d/%m/%Y %r") AS fechaUpdate
        FROM proyecto.proveedor where id = ?;
`,
      [id]
    )
    .then((response_database) => {
      if (response_database.result.length > 0) {
        return res.status(200).json({
          response_database,
        });
      } else {
        return res.status(200).json({ log: "PROVEEDOR NO ENCONTRADA" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  viewProveedor,
};
