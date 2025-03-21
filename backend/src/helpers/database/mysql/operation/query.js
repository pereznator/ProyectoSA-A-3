const pool = require("../config/mysql");

const query = (sql) => {
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection(function (err, connection) {
        if (err) {
          reject({
            ret: 0,
            msg:
              "ERROR: ocurrió un error al obtener conexión con la db: " + err,
          });
        } else {
          if (connection) {
            console.log(sql);
            connection.query(sql, function (error, result) {
              if (error) {
                connection.release();
                reject({
                  ret: 0,
                  msg: "ERROR: ocurrió un error al ejecutar query: " + error,
                });
              } else {
                connection.release();
                resolve({ ret: 1, result: result });
              }
            });
          } else {
            reject({
              ret: 0,
              msg: "ERROR: ocurrió un error con la conexión a la db",
            });
          }
        }
      });
    } catch (error) {
      reject({
        ret: 0,
        msg: "ERROR: ocurrió un error al obtener conexión con la db: " + error,
      });
    }
  });
};

module.exports = { query };
