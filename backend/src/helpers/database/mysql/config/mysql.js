var mysql = require("mysql");
var pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_PROXY,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    dateStrings : true
  });
} catch (error) {
  console.log(error);
}
pool.on("acquire", function (connection) {
  console.log("Connection %d acquired", connection.threadId);
});
pool.on("connection", function (connection) {
  // connection.query("SET SESSION auto_increment_increment=1");
});
pool.on("enqueue", function () {
  console.log("Waiting for available connection slot");
});
pool.on("release", function (connection) {
  console.log("Connection %d released", connection.threadId);
});
module.exports = pool;
