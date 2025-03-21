const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updateOferta = async (req, res) => {
  const { id } = req.params;
  const {
    descripcion,
    monto,
    fecha_vencimiento,
    producto_id,
    estado_oferta_id,
  } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT 
        CONVERT(oferta.descripcion, CHAR) as descripcion,
        oferta.monto,
        oferta.fecha_vencimiento,
        oferta.producto_id,
        oferta.estado_oferta_id
      FROM proyecto.oferta   
        where oferta.id = ?
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
            UPDATE proyecto.oferta
                SET descripcion=?, monto=?, fecha_vencimiento=?, fecha_update=current_timestamp(), producto_id=?, estado_oferta_id=?
            WHERE id=?;`,
            [
              descripcion == null
                ? response_search.result[0].descripcion
                : descripcion,
              monto == null ? response_search.result[0].monto : monto,
              fecha_vencimiento == null
                ? response_search.result[0].fecha_vencimiento
                : fecha_vencimiento,
              producto_id == null
                ? response_search.result[0].producto_id
                : producto_id,
              estado_oferta_id == null
                ? response_search.result[0].estado_oferta_id
                : estado_oferta_id,
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
        return res.status(200).json({ log: "OFERTA NO ENCONTRADA" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateOferta,
};
