const connection = require("../db");
const { actualizarEstadoMesa } = require("../actualizarMesa");

exports.actualizarCantidad = (req, res) => {
  const mesaId = req.params.mesa_id;
  const productoId = req.params.producto_id;
  const { cantidad } = req.body;

  // Validar que la cantidad sea un número válido
  if (typeof cantidad !== "number" || isNaN(cantidad)) {
    return res
      .status(400)
      .json({ error: "La cantidad debe ser un número válido." });
  }

  const updateQuery =
    "UPDATE carrito_compras SET cantidad = ? WHERE mesa_id = ? AND producto_id = ?";
  connection.query(
    updateQuery,
    [cantidad, mesaId, productoId],
    (error, results) => {
      if (error) {
        console.error(
          "Error al actualizar la cantidad del producto en el carrito:",
          error
        );
        res.status(500).json({
          error: "Error al actualizar la cantidad del producto en el carrito",
        });
      } else {
        res.status(200).json({
          message: "Cantidad del producto actualizada correctamente",
        });
      }
    }
  );
};

exports.actualizarPrecio = (req, res) => {
  const mesaId = req.params.mesa_id;
  const productoId = req.params.producto_id;
  const { precio_venta } = req.body;

  // Validar que el precio_venta sea un número válido
  if (typeof precio_venta !== "number" || isNaN(precio_venta)) {
    return res
      .status(400)
      .json({ error: "El precio de venta debe ser un número válido." });
  }

  const updateQuery =
    "UPDATE carrito_compras SET precio_venta = ? WHERE mesa_id = ? AND producto_id = ?";
  connection.query(
    updateQuery,
    [precio_venta, mesaId, productoId],
    (error, results) => {
      if (error) {
        console.error(
          "Error al actualizar el precio del producto en el carrito:",
          error
        );
        res.status(500).json({
          error: "Error al actualizar el precio del producto en el carrito",
        });
      } else {
        res
          .status(200)
          .json({ message: "Precio del producto actualizado correctamente" });
      }
    }
  );
};

exports.getProductosEnCarrito = (req, res) => {
  const mesaId = req.params.mesa_id;

  // Realiza una consulta a la base de datos para obtener los productos del carrito_compras asociados a la mesa
  const query = `
    SELECT cc.*, p.* 
    FROM carrito_compras cc
    JOIN productos p ON cc.producto_id = p.producto_id
    WHERE cc.mesa_id = ?`;

  connection.query(query, [mesaId], (error, results) => {
    if (error) {
      console.error("Error al obtener productos en carrito_compras:", error);
      res.status(500).json({
        error: "Error al obtener productos en carrito_compras",
      });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.getProductoExiste = (req, res) => {
  const mesaId = req.params.mesa_id; // Cambio realizado aquí
  const productoId = req.params.producto_id; // Cambio realizado aquí

  const query = `
    SELECT *
    FROM carrito_compras
    WHERE mesa_id = ? AND producto_id = ?`;

  connection.query(query, [mesaId, productoId], (error, results) => {
    if (error) {
      console.error("Error al obtener el producto en carrito_compras:", error);
      res.status(500).json({
        error: "Error al obtener el producto en carrito_compras",
      });
    } else {
      const productoEnCarrito = results[0];
      res.status(200).json(productoEnCarrito);
    }
  });
};

exports.agregarProductoAlCarrito = (req, res) => {
  const { mesa_id, producto_id, cantidad, precio_venta } = req.body;
  if (!mesa_id || !producto_id || !cantidad || precio_venta === undefined) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  connection.query(
    "SELECT * FROM carrito_compras WHERE mesa_id = ? AND producto_id = ?",
    [mesa_id, producto_id],
    (error, results, fields) => {
      if (error) {
        console.error(
          "Error al consultar el producto en el carrito: " + error.stack
        );
        res.status(500).json({
          error: "Error al consultar el producto en el carrito.",
        });
        return;
      }

      if (results.length > 0) {
        // Si el producto ya existe en el carrito, aumentar la cantidad
        const cantidadActual = results[0].cantidad;
        const nuevaCantidad = cantidadActual + cantidad;
        connection.query(
          "UPDATE carrito_compras SET cantidad = ? WHERE mesa_id = ? AND producto_id = ?",
          [nuevaCantidad, mesa_id, producto_id],
          (error, results, fields) => {
            if (error) {
              console.error(
                "Error al aumentar la cantidad del producto en el carrito: " +
                  error.stack
              );
              res.status(500).json({
                error:
                  "Error al aumentar la cantidad del producto en el carrito.",
              });
            } else {
              res.json({
                message: "Cantidad del producto actualizada en el carrito.",
              });
            }
          }
        );
      } else {
        // Si el producto no existe en el carrito, agregarlo
        connection.query(
          "INSERT INTO carrito_compras (mesa_id, producto_id, cantidad, precio_venta) VALUES (?, ?, ?, ?)",
          [mesa_id, producto_id, cantidad, precio_venta],
          (error, results, fields) => {
            if (error) {
              console.error(
                "Error al insertar el producto en el carrito de compras: " +
                  error.stack
              );
              res.status(500).json({
                error:
                  "Error al insertar el producto en el carrito de compras.",
              });
            } else {
              res.json({ message: "Producto agregado al carrito." });
              // Actualizar el estado de la mesa a "Ocupada" en la tabla "Mesas"
              actualizarEstadoMesa(mesa_id);
            }
          }
        );
      }
    }
  );
};

exports.eliminarProductoDelCarrito = (req, res) => {
  const mesaId = req.params.mesa_id;
  const productoId = req.params.producto_id;

  // Construye la consulta SQL para eliminar el producto del carrito
  const deleteQuery =
    "DELETE FROM carrito_compras WHERE mesa_id = ? AND producto_id = ?";
  connection.query(deleteQuery, [mesaId, productoId], (error, results) => {
    if (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      res
        .status(500)
        .json({ error: "Error al eliminar el producto del carrito" });
    } else {
      if (results.affectedRows > 0) {
        // Si la consulta afectó alguna fila, significa que se eliminó el producto correctamente
        res
          .status(200)
          .json({ message: "Producto eliminado del carrito correctamente" });
      } else {
        // Si la consulta no afectó ninguna fila, significa que el producto no estaba en el carrito
        res
          .status(404)
          .json({ error: "El producto no se encontraba en el carrito" });
      }
    }
  });
};

exports.vaciarCarrito = (req, res) => {
  const mesaId = req.params.mesa_id;

  // Construye la consulta SQL para eliminar el producto del carrito
  const deleteQuery = "DELETE FROM carrito_compras WHERE mesa_id = ?";
  connection.query(deleteQuery, [mesaId], (error, results) => {
    if (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      res
        .status(500)
        .json({ error: "Error al eliminar el producto del carrito" });
    } else {
      if (results.affectedRows > 0) {
        // Si la consulta afectó alguna fila, significa que se eliminó el producto correctamente
        res
          .status(200)
          .json({ message: "Producto eliminado del carrito correctamente" });
      } else {
        // Si la consulta no afectó ninguna fila, significa que el producto no estaba en el carrito
        res
          .status(404)
          .json({ error: "El producto no se encontraba en el carrito" });
      }
    }
  });
};
