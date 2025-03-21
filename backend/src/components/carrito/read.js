const dinamodb = require("../../helpers/database/dynamodb/dynamodb");
const readCarrito = async (req, res) => {
  await dinamodb
    .readObjects("carrito")
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

module.exports = { readCarrito };
