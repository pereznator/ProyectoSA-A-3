const dinamodb = require("../../helpers/database/dynamodb/dynamodb");
const createValoracionPagina = async (req, res) => {
  const { valoracion_pagina } = req.body;
  await dinamodb
    .putObject("valoracion-pagina", {
      valoracion_pagina,
    })
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
  createValoracionPagina,
};
