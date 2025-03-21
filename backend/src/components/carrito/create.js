const dinamodb = require("../../helpers/database/dynamodb/dynamodb");
const createCarrito = async (req, res) => {
  const { carrito } = req.body;
  await dinamodb
    .putObject("carrito", {
      carrito,
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
  createCarrito,
};
