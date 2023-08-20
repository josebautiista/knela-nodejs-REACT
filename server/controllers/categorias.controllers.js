const connection = require("../db");

exports.getCategorias = (req, res) => {
  connection.query("SELECT * FROM categorias", (error, results, fields) => {
    if (error) {
      console.error("Error al realizar la consulta: " + error.stack);
      res.status(500).send("Error al realizar la consulta.");
      return;
    }
    res.json(results);
  });
};
