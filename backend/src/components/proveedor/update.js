const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT id, 
             CONVERT(nombre, CHAR) AS nombre
      FROM proyecto.proveedor
      where id = ?
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
          UPDATE proyecto.proveedor
                SET nombre=?, fecha_update=current_timestamp()
                WHERE id=?;`,
            [
              nombre == null
                ? response_search.result[0].nombre
                : nombre,
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
        return res.status(200).json({ log: "PROVEEDOR NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateProveedor,
};
