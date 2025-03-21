const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateIngresoMercaderia = async (req, res) => {
  const { id } = req.params;
  const { correlativo } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT id, 
             CONVERT(correlativo, CHAR) AS correlativo
      FROM proyecto.ingreso_mercaderia
      where id = ?
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
          UPDATE proyecto.ingreso_mercaderia
                SET correlativo=?, fecha_update=current_timestamp()
                WHERE id=?;`,
            [
              correlativo == null
                ? response_search.result[0].correlativo
                : correlativo,
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
        return res.status(200).json({ log: "INGRESO MERCADERIA NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateIngresoMercaderia,
};
