const dinamodb = require("../../helpers/database/dynamodb/dynamodb");
const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const viewCarritoPorCliente = async (req, res) => {
  const { idCliente } = req.params;
  query_format.queryFormat(
    `
    SELECT
      c.carrito_id
    FROM proyecto.cliente c
    WHERE c.id = ?;
    `,
    [idCliente]
  ).then(response_database => {
    if (response_database.result.length == 0) {
      return res.status(404).json({msj: "No se encontro cliente."});
    }
    const carrito_id = response_database.result[0].carrito_id;
    if (carrito_id === null) {
      return res.status(400).json({msj: "El cliente no tiene carrito asignado."});
    }
    dinamodb
    .viewObject("carrito", { id: carrito_id })
    .then((response_dinamodb) => {
      return res.status(200).json({
        response_dinamodb,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error });
    });
  }).catch(error => {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  });
};
module.exports = {
  viewCarritoPorCliente,
};
