const mysql = require("mysql");
const pool = require("../config/mysql");

const queryFormat = (query, inserts) => {
  let sql = mysql.format(query, inserts);
  console.log(sql);
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
          reject({
            ret: 0,
            msg:
              "ERROR: ocurrió un error al obtener conexión con la db: " + err,
          });
        } else {
          if (connection) {
            connection.query(sql, function (error, result) {
              if (error) {
                console.log(error);
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
      console.log(err);
      reject({
        ret: 0,
        msg: "ERROR: ocurrió un error al obtener conexión con la db: " + error,
      });
    }
  });
};
const queryFormatWithTransaction = (query, inserts) => {
  let sql = mysql.format(query, inserts);
  console.log(sql);
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
          reject({
            ret: 0,
            msg:
              "ERROR: ocurrió un error al obtener conexión con la db: " + err,
          });
        } else {
          if (connection) {
            connection.beginTransaction(function (err) {
              if (err) {
                console.log(err);
                connection.release();
                reject({
                  ret: 0,
                  msg:
                    "ERROR: ocurrió un error al iniciar la transacción: " + err,
                });
              } else {
                connection.query(sql, function (error, result) {
                  if (error) {
                    console.log(error);
                    connection.rollback(function () {
                      connection.release();
                      reject({
                        ret: 0,
                        msg:
                          "ERROR: ocurrió un error al ejecutar query: " + error,
                      });
                    });
                  } else {
                    connection.commit(function (err) {
                      if (err) {
                        console.log(err);
                        connection.rollback(function () {
                          connection.release();
                          reject({
                            ret: 0,
                            msg:
                              "ERROR: ocurrió un error al confirmar la transacción: " +
                              err,
                          });
                        });
                      } else {
                        connection.release();
                        resolve({ ret: 1, result: result });
                      }
                    });
                  }
                });
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
      console.log(err);
      reject({
        ret: 0,
        msg: "ERROR: ocurrió un error al obtener conexión con la db: " + error,
      });
    }
  });
};
const queryFormatWithTransactionArray = (array) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(array);
      let results = [];
      pool.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
          reject({
            ret: 0,
            msg:
              "ERROR: ocurrió un error al obtener conexión con la db: " + err,
          });
        } else {
          if (connection) {
            connection.beginTransaction(function (err) {
              if (err) {
                console.log(err);
                connection.release();
                reject({
                  ret: 0,
                  msg:
                    "ERROR: ocurrió un error al iniciar la transacción: " + err,
                });
              } else {
                console.log('TRANSACTION BEGIN');
                array.map((actual, index) => {
                  let sql = mysql.format(actual.query, actual.inserts);
                  console.log(index, sql);
                  connection.query(sql, function (error, result) {
                    if (error) {
                      console.log(error);
                      connection.rollback(function () {
                        connection.release();
                        reject({
                          ret: 0,
                          msg:
                            "ERROR: ocurrió un error al ejecutar query: " +
                            error,
                        });
                      });
                    } else {
                      results.push(result);
                      if (index == array.length - 1) {
                        connection.commit(function (err) {
                          if (err) {
                            console.log(err);
                            connection.rollback(function () {
                              connection.release();
                              reject({
                                ret: 0,
                                msg:
                                  "ERROR: ocurrió un error al confirmar la transacción: " +
                                  err,
                              });
                            });
                          } else {
                            console.log('TRANSACTION COMMIT');
                            connection.release();
                            resolve({ ret: 1, results: results });
                          }
                        });
                      }
                    }
                  });
                });
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
      console.log(error);
      reject({
        ret: 0,
        msg: "ERROR: ocurrió un error al obtener conexión con la db: " + error,
      });
    }
  });
};
const queryFormatArray = (array) => {
  return new Promise((resolve, reject) => {
    try {
      let results = [];
      pool.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
          reject({
            ret: 0,
            msg:
              "ERROR: ocurrió un error al obtener conexión con la db: " + err,
          });
        } else {
          if (connection) {
            array.map((actual, index) => {
              let sql = mysql.format(actual.query, actual.inserts);
              console.log(sql);
              connection.query(sql, function (error, result) {
                if (error) {
                  console.log(error);
                  connection.release();
                  reject({
                    ret: 0,
                    msg: "ERROR: ocurrió un error al ejecutar query: " + error,
                  });
                } else {
                  results.push(result);
                  if (index == array.length - 1) {
                    connection.release();
                    resolve({ ret: 1, results: results });
                  }
                }
              });
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
      console.log(error);
      reject({
        ret: 0,
        msg: "ERROR: ocurrió un error al obtener conexión con la db: " + error,
      });
    }
  });
};
module.exports = {
  queryFormat,
  queryFormatWithTransaction,
  queryFormatWithTransactionArray,
  queryFormatArray,
};
