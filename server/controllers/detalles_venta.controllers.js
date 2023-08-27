const connection = require("../db");

exports.getDetallesVenta = (req, res) => {
  const ventaId = req.query.venta_id;

  const query = `
  SELECT dv.detalle_id, dv.venta_id, dv.producto_id, dv.cantidad, dv.precio_venta, dv.valor_total,
  p.nombre AS nombre_producto
  FROM Detalles_Venta dv
  JOIN Productos p ON dv.producto_id = p.producto_id
  WHERE dv.venta_id = ?;
  `;

  connection.query(query, [ventaId], (error, results) => {
    if (error) {
      console.error("Error al obtener los detalles de la venta:", error);
      res
        .status(500)
        .json({ error: "Error al obtener los detalles de la venta" });
    } else {
      res.status(200).json(results);
    }
  });
};
