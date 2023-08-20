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
