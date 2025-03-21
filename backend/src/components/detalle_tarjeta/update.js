const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateDetalleTarjeta = async (req, res) => {
  const { id } = req.params;
  const { numero_tarjeta, cvv, fecha_exp } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT         
        CONVERT(numero_tarjeta, CHAR) AS numero_tarjeta,
        cvv,        
        fecha_exp,        
      FROM proyecto.detalle_tarjeta
      where detalle_tarjeta.id = ?;
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
            UPDATE proyecto.detalle_tarjeta
            SET numero_tarjeta=?, cvv=?, fecha_exp=?, fecha_update=current_timestamp()
            WHERE id=?;`,
            [
              numero_tarjeta == null
                ? response_search.result[0].numero_tarjeta
                : numero_tarjeta,
              cvv == null ? response_search.result[0].cvv : cvv,
              fecha_exp == null
                ? response_search.result[0].fecha_exp
                : fecha_exp,
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
        return res.status(200).json({ log: "DETALLE TARJETA NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateDetalleTarjeta,
};
