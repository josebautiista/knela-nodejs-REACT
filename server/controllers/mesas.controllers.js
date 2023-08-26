const connection = require("../db");
const { actualizarEstadoMesa } = require("../actualizarMesa");

exports.getMesas = (req, res) => {
  connection.query("SELECT * FROM mesas", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      result.forEach((res) => {
        actualizarEstadoMesa(res.mesa_id);
      });
    }
  });
};

exports.crearMesa = (req, res) => {
  const { capacidad, estado } = req.body;

  connection.query(
    "INSERT INTO mesas (capacidad, estado, mesa_id2) VALUES (?, ?, UUID())",
    [capacidad, estado],
    (err, result) => {
      if (err) {
        console.error("Error al crear la nueva mesa: " + err.stack);
        res.status(500).json({
          error: "Error al crear la nueva mesa.",
        });
      } else {
        res.json({ message: "Mesa agregada correctamente." });
      }
    }
  );
};
