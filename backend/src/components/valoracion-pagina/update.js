const dinamodb = require("../../helpers/database/dynamodb/dynamodb");
const moment = require("moment-timezone");
const updateValoracionPagina = async (req, res) => {
  const { id } = req.params;
  const { valoracion_pagina } = req.body;
  const fecha_actualizacion = moment(new Date())
    .tz("America/Guatemala")
    .format();
  let UpdateExpression = `set fecha_actualizacion =:fecha_actualizacion`;
  let ExpressionAttributeValues = {
    ":fecha_actualizacion": fecha_actualizacion,
  };
  if (valoracion_pagina) {
    UpdateExpression += `, valoracion_pagina =:valoracion_pagina`;
    ExpressionAttributeValues[":valoracion_pagina"] = valoracion_pagina;
  }
  await dinamodb
    .updateObject(
      "valoracion-pagina",
      { id },
      UpdateExpression,
      ExpressionAttributeValues
    )
    .then((response_database) => {
      return res.status(200).json({
        response_database,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error });
    });
};

module.exports = {
  updateValoracionPagina,
};
