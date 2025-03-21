const dinamodb = require("../../helpers/database/dynamodb/dynamodb");
const createListaDeseos = async (req, res) => {
  const { lista_deseos } = req.body;
  await dinamodb
    .putObject("lista-deseos", {
      lista_deseos,
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
  createListaDeseos,
};
