const connection = require("./db");

module.exports.actualizarEstadoMesa = (mesa_id) => {
  const checkProductosQuery =
    "SELECT COUNT(*) AS count FROM carrito_compras WHERE mesa_id = ?";
  connection.query(checkProductosQuery, [mesa_id], (error, results) => {
    if (error) {
      console.error(
        "Error al verificar productos en el carrito de compras:",
        error
      );
    } else {
      const tieneProductos = results[0].count > 0;
      const nuevoEstado = tieneProductos ? "Ocupada" : "Disponible";

      const updateMesaQuery = "UPDATE Mesas SET estado = ? WHERE mesa_id = ?";
      connection.query(updateMesaQuery, [nuevoEstado, mesa_id], (error) => {
        if (error) {
          console.error("Error al actualizar el estado de la mesa:", error);
        }
      });
    }
  });
};
