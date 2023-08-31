const connection = require("../db");

exports.getInventario = (req, res) => {
  const sql = `
  SELECT 
  detalles_inventario.id AS detalle_id, detalles_inventario.cantidad AS cantidad_detalle,
  inventarios.inventario_id, inventarios.fecha,
  ingredientes.ingrediente_id, ingredientes.nombre AS nombre_ingrediente,
  ingredientes.cantidad AS cantidad_ingrediente, ingredientes.unidad_medida, ingredientes.precio_compra
FROM detalles_inventario
INNER JOIN inventarios ON detalles_inventario.inventario_id = inventarios.inventario_id
INNER JOIN ingredientes ON detalles_inventario.ingrediente_id = ingredientes.ingrediente_id
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

exports.crearInventario = (req, res) => {
  const insertQuery = "INSERT INTO inventarios (fecha) VALUES (CURDATE())";
  connection.query(insertQuery, (err, result) => {
    if (err) {
      console.error("Error al crear el inventario:", err);
      res.status(500).send("Error al crear el inventario.");
    } else {
      console.log("Inventario creado exitosamente.");

      // Obtiene las cantidades de ingredientes disponibles
      const selectIngredientesQuery =
        "SELECT ingrediente_id, cantidad FROM ingredientes";
      connection.query(selectIngredientesQuery, (err, ingredientes) => {
        if (err) {
          console.error(
            "Error al obtener las cantidades de ingredientes:",
            err
          );
          res
            .status(500)
            .send("Error al obtener las cantidades de ingredientes.");
        } else {
          // Inserta las cantidades en la tabla de detalles de inventario
          const inventarioId = result.insertId;
          const insertDetallesQuery =
            "INSERT INTO detalles_inventario (inventario_id, ingrediente_id, cantidad) VALUES (?, ?, ?)";
          ingredientes.forEach((ingrediente) => {
            connection.query(
              insertDetallesQuery,
              [inventarioId, ingrediente.ingrediente_id, ingrediente.cantidad],
              (err) => {
                if (err) {
                  console.error(
                    "Error al insertar detalle de inventario:",
                    err
                  );
                }
              }
            );
          });

          res.status(200).send("Inventario creado exitosamente.");
        }
      });
    }
  });
};

exports.verificarInventarioPorFecha = (req, res) => {
  const fecha = req.params.fecha;

  const verificarQuery =
    "SELECT COUNT(*) AS count FROM inventarios WHERE fecha = ?";
  connection.query(verificarQuery, [fecha], (err, result) => {
    if (err) {
      console.error("Error al verificar inventario por fecha:", err);
      res.status(500).json({ error: "Error al verificar inventario." });
    } else {
      const inventarioExistente = result[0].count > 0;
      res.json({ inventarioExistente });
    }
  });
};

exports.obtenerProductosPorFecha = (req, res) => {
  const { fecha } = req.params;

  const sql = `
    SELECT 
      detalles_inventario.id AS detalle_id, detalles_inventario.cantidad AS cantidad_detalle,
      inventarios.inventario_id, inventarios.fecha,
      ingredientes.ingrediente_id, ingredientes.nombre AS nombre_ingrediente,
      ingredientes.cantidad AS cantidad_ingrediente, ingredientes.unidad_medida, ingredientes.precio_compra
    FROM detalles_inventario
    INNER JOIN inventarios ON detalles_inventario.inventario_id = inventarios.inventario_id
    INNER JOIN ingredientes ON detalles_inventario.ingrediente_id = ingredientes.ingrediente_id
    WHERE inventarios.fecha = ?
  `;

  connection.query(sql, [fecha], (err, result) => {
    if (err) {
      console.error("Error al obtener los productos de inventario:", err);
      res
        .status(500)
        .json({ error: "Error al obtener los productos de inventario" });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.getAllIngredients = (req, res) => {
  const query = "SELECT * FROM ingredientes";
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los ingredientes" });
    } else {
      res.json(results);
    }
  });
};
