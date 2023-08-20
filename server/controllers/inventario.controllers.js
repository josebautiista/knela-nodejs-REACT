const connection = require("../db");

exports.getInventario = (req, res) => {
  const sql = `
    SELECT productos.producto_id, productos.nombre AS nombre_producto,
           productos.precio_unitario, productos.cantidad_disponible,
           categorias.nombre AS nombre_categoria
    FROM productos
    INNER JOIN categorias ON productos.categoria_id = categorias.categoria_id
  `;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener los productos:", err);
      res.status(500).json({ error: "Error al obtener los productos" });
    } else {
      res.status(200).json(result);
    }
  });
};
