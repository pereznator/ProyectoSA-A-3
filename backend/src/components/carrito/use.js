const moment = require("moment-timezone");
const dinamodb = require("../../helpers/database/dynamodb/dynamodb");
const query_format = require("../../helpers/database/mysql/operation/queryFormat");

const useCarrito = async (req, res) => {
  const { idCliente } = req.params;
  const { carrito } = req.body;

  query_format.queryFormat(
    `
    SELECT
      c.carrito_id
    FROM proyecto.cliente c
    WHERE c.id = ?;
    `,
    [idCliente]
  ).then((response_database) => {
    console.log(response_database);
    if (response_database.result.length == 0) {
      return res.status(404).json({msj: "No se encontro cliente."});
    }
    const carrito_id = response_database.result[0].carrito_id;

    if (carrito_id === null || carrito_id === "") {
      return dinamodb
        .putObject("carrito", {
          carrito,
        })
        .then((response_dinamodb) => {

          const nuevo_carrito_id = response_dinamodb.id;
          
          query_format.queryFormatWithTransaction(
            `
            UPDATE proyecto.cliente
            SET carrito_id = ?
            WHERE id = ? ;
            `,
            [nuevo_carrito_id, idCliente]
          ).then((cliente_response) => {
            return res.status(200).json({
              cliente_response,
              response_dinamodb
            });
          }).catch(err => {
            console.log(err);
            return res.status(500).json({ error: err.toString() });
          });

        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ error });
        });
    }

    return dinamodb
    .viewObject("carrito", { id: carrito_id })
    .then((response_dinamodb) => {
      console.log(response_dinamodb);
      const idProducto = carrito.productos[0].producto_id;
      const itemIndex = response_dinamodb.carrito.productos.findIndex(producto => producto.producto_id === idProducto);
      if (itemIndex !== -1) {
        response_dinamodb.carrito.productos[itemIndex].cantidad += carrito.productos[0].cantidad;
      } else {
        response_dinamodb.carrito.productos.push(carrito.productos[0]);
      }
      const fecha_actualizacion = moment(new Date()).tz("America/Guatemala").format();
      let UpdateExpression = `set fecha_actualizacion =:fecha_actualizacion`;
      let ExpressionAttributeValues = {
        ":fecha_actualizacion": fecha_actualizacion,
      };
      
      UpdateExpression += `, carrito =:carrito`;
      ExpressionAttributeValues[":carrito"] = response_dinamodb.carrito;
      
      return dinamodb
      .updateObject(
        "carrito",
        { id: carrito_id },
        UpdateExpression,
        ExpressionAttributeValues
      )
      .then((carrito_dinamodb) => {
        return res.status(200).json({
          carrito_dinamodb,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error });
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    });
  });
};

module.exports = {
  useCarrito,
};
