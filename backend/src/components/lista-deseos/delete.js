const dinamodb = require("../../helpers/database/dynamodb/dynamodb");
const deleteListaDeseos = async (req, res) => {
  const { id } = req.params;
  await dinamodb
    .deleteObject("lista-deseos", { id })
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
module.exports = { deleteListaDeseos };
