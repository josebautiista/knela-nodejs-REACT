const connection = require("../db"); // Asume que tienes un archivo de conexión a la base de datos

exports.getMediosDePago = (req, res) => {
  connection.query("SELECT * FROM medios_de_pago", (err, results) => {
    if (err) {
      console.error("Error al obtener los medios de pago:", err);
      res.status(500).json({ error: "Error al obtener los medios de pago" });
    } else {
      res.json(results);
    }
  });
};
