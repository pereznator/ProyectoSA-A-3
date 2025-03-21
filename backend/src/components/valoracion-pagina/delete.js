const dinamodb = require("../../helpers/database/dynamodb/dynamodb");
const deleteValoracionPagina = async (req, res) => {
  const { id } = req.params;
  await dinamodb
    .deleteObject("valoracion-pagina", { id })
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
module.exports = { deleteValoracionPagina };
