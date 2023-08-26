const connection = require("../db");
const { actualizarEstadoMesa } = require("../actualizarMesa");

exports.getVentas = (req, res) => {
  const query = `
    SELECT v.*, c.nombre AS nombre_cliente, c.telefono AS telefono_cliente, c.email AS email_cliente
    FROM Ventas v
    JOIN Clientes c ON v.cliente_id = c.cliente_id`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error al obtener las ventas:", error);
      res.status(500).json({ error: "Error al obtener las ventas" });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.crearVenta = (req, res) => {
  const { cliente_id, detalles, mesa_id, medio_pago_id, cantidad_pago } =
    req.body;

  let ventaExitosa = true; // Variable para rastrear el éxito de la venta

  const insertVentaQuery =
    "INSERT INTO Ventas (cliente_id, fecha_hora, total) VALUES (?, NOW(), 0)";

  connection.query(insertVentaQuery, [cliente_id], (error, result) => {
    if (error) {
      console.error("Error al insertar la venta:", error);
      ventaExitosa = false; // Marcar la venta como no exitosa
    } else {
      const venta_id = result.insertId;

      const insertDetallesQuery =
        "INSERT INTO Detalles_Venta (venta_id, producto_id, cantidad, precio_venta, valor_total, medio_pago_id, cantidad_pago) VALUES (?, ?, ?, ?, ?, ?, ?)";

      detalles.forEach((detalle) => {
        const {
          producto_id,
          cantidad,
          precio_venta,
          valor_total,
          medio_pago_id,
          cantidad_pago,
        } = detalle;

        const values = [
          venta_id,
          producto_id,
          cantidad,
          precio_venta,
          valor_total,
          medio_pago_id,
          cantidad_pago,
        ];

        connection.query(insertDetallesQuery, values, (error) => {
          if (error) {
            console.error("Error al insertar detalle de venta:", error);
            ventaExitosa = false; // Marcar la venta como no exitosa
          }
        });
      });

      const updateVentaQuery =
        "UPDATE Ventas SET total = (SELECT SUM(Detalles_Venta.valor_total) FROM Detalles_Venta WHERE Detalles_Venta.venta_id = ?) WHERE venta_id = ?";
      connection.query(updateVentaQuery, [venta_id, venta_id], (error) => {
        if (error) {
          console.error("Error al calcular el total de la venta:", error);
          ventaExitosa = false; // Marcar la venta como no exitosa
        } else {
          actualizarEstadoMesa(mesa_id);
        }
      });
    }

    if (ventaExitosa) {
      res.status(201).json({ message: "Nueva venta creada con éxito" });
    } else {
      res.status(500).json({ error: "Error al realizar la venta" });
    }
  });
};
