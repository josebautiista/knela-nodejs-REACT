const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "bernardo",
  database: "knela",
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: ", err);
  } else {
    console.log("Conexión exitos a la base de datos");
  }
});

module.exports = connection;
