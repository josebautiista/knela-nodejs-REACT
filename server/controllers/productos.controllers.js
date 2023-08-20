const connection = require("../db");

exports.getProductosPorCategoria = (req, res) => {
  const categoriaId = req.query.id;

  connection.query(
    "SELECT * FROM productos WHERE categoria_id = ?",
    [categoriaId],
    (error, results, fields) => {
      if (error) {
        console.error("Error al realizar la consulta: " + error.stack);
        res.status(500).send("Error al realizar la consulta.");
        return;
      }
      res.json(results);
    }
  );
};
