const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const updatePedido = async (req, res) => {
  const { id } = req.params;
  const { estado_pedido_id, oferta_id, cliente_id } = req.body;
  query_format
    .queryFormat(
      `        
      SELECT        
          estado_pedido_id,
          oferta_id,
          cliente_id
      FROM proyecto.pedido
      where id = ${id}
        `,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        query_format
          .queryFormatWithTransaction(
            `
            UPDATE proyecto.pedido
            SET  fecha_update=current_timestamp(), estado_pedido_id=?, oferta_id=?, cliente_id=?
            WHERE id = ${id};`,
            [
              estado_pedido_id == null
                ? response_search.result[0].estado_pedido_id
                : estado_pedido_id,
              oferta_id == null
                ? response_search.result[0].oferta_id
                : oferta_id,
              cliente_id == null
                ? response_search.result[0].cliente_id
                : cliente_id,
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
        return res.status(200).json({ log: "PEDIDO NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updatePedido,
};
