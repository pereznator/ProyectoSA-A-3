const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateEstadoCivil = async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT id, 
             descripcion
      FROM proyecto.estado_civil
      where id = ?
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
          UPDATE proyecto.estado_civil
                SET descripcion=?, fecha_update=current_timestamp()
                WHERE id=?;`,
            [
              descripcion == null
                ? response_search.result[0].descripcion
                : descripcion,
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
        return res.status(200).json({ log: "ESTADO CIVIL NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateEstadoCivil,
};
