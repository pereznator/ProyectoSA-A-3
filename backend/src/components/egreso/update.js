const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateEgreso = async (req, res) => {
  const { id } = req.params;
  const { monto } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT 
        monto        
        FROM proyecto.egreso
        where id = ?
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
          UPDATE proyecto.egreso
                SET monto=?, fecha_update=current_timestamp()
                WHERE id=?;`,
            [
              monto == null
                ? response_search.result[0].monto
                : monto,
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
        return res.status(200).json({ log: "EGRESO NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateEgreso,
};
