const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const { v4 } = require("uuid");

const createExistenciaBulk = async (req, res) => {
  const { cantidad, producto_id, monto } = req.body;

  query_format
    .queryFormatWithTransaction(
      `INSERT INTO proyecto.ingreso_mercaderia
  ( correlativo, fecha_registro, fecha_update)
  VALUES(?, current_timestamp(), current_timestamp());`,
      [v4()]
    )
    .then((response_ingreso) => {
      let querys = Array.from({ length: cantidad }, (_, index) => ({
        query: `INSERT INTO proyecto.existencia
     (correlativo, producto_id, estado_existencia_id, ingreso_mercaderia_id)
     VALUES(?, ?, ?, ?);`,
        inserts: [v4(), producto_id, 1, response_ingreso.result.insertId],
      }));
      querys.push({
        query: `INSERT INTO proyecto.egreso
      ( correlativo, monto, ingreso_mercaderia_id)
      VALUES(?,?,?);`,
        inserts: [v4(), monto, response_ingreso.result.insertId],
      });
      query_format
        .queryFormatWithTransactionArray(querys)
        .then((response_database) => {
          return res.status(200).json({ response_ingreso, response_database });
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ log: error });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  createExistenciaBulk,
};
