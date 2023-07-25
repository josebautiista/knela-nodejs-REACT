const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "bernardo",
  database: "knela",
});

app.get("/mesas", (req, res) => {
  connection.query("SELECT * FROM mesas", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/categorias", (req, res) => {
  // Realiza la consulta
  connection.query("SELECT * FROM categorias", (error, results, fields) => {
    if (error) {
      console.error("Error al realizar la consulta: " + error.stack);
      res.status(500).send("Error al realizar la consulta.");
      return;
    }
    res.json(results);
  });
});

app.get("/productos", (req, res) => {
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
});

app.get("/products", (req, res) => {
  const mesaId = req.query.mesaId;
  const query = `
  SELECT m.*, p.*, pr.*
  FROM mesa m
  JOIN producto p ON m.id = p.mesa
  JOIN productos pr ON p.nombre = pr.id
  WHERE m.id = ?`;

  connection.query(query, [mesaId], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// Agrega esta nueva ruta al final de tu archivo de servidor Express

app.get("/carrito_compras/:mesa_id", (req, res) => {
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
});

app.delete("/carrito_compras/:mesa_id", (req, res) => {
  const mesaId = req.params.mesa_id;

  const deleteQuery = "DELETE FROM carrito_compras WHERE mesa_id = ?";
  connection.query(deleteQuery, [mesaId], (error) => {
    if (error) {
      console.error(
        "Error al eliminar productos del carrito de compras:",
        error
      );
      res
        .status(500)
        .json({ error: "Error al eliminar productos del carrito de compras" });
    } else {
      console.log(
        `Se han eliminado los productos asociados a la mesa ${mesaId}`
      );
      res.status(200).json({ message: "Productos eliminados correctamente" });
    }
  });
});

app.post("/carrito_compras", (req, res) => {
  const { mesa_id, producto_id, cantidad } = req.body;
  if (!mesa_id || !producto_id || !cantidad) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  const insertQuery =
    "INSERT INTO carrito_compras (mesa_id, producto_id, cantidad) VALUES (?, ?, ?)";
  connection.query(
    insertQuery,
    [mesa_id, producto_id, cantidad],
    (error, results, fields) => {
      if (error) {
        console.error(
          "Error al insertar el producto en el carrito de compras: " +
            error.stack
        );
        res.status(500).json({
          error: "Error al insertar el producto en el carrito de compras.",
        });
      } else {
        // Actualizar el estado de la mesa a "Ocupada" en la tabla "Mesas"
        const updateMesaQuery =
          "UPDATE Mesas SET estado = 'Ocupada' WHERE mesa_id = ?";
        connection.query(updateMesaQuery, [mesa_id], (error) => {
          if (error) {
            console.error("Error al actualizar el estado de la mesa:", error);
          } else {
            res.status(201).json({
              message: "Producto agregado al carrito de compras exitosamente.",
            });
          }
        });
      }
    }
  );
});

app.get("/ventas", (req, res) => {
  // Consulta SQL para obtener todas las ventas con los datos del cliente
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
});

app.get("/detalles_venta", (req, res) => {
  const ventaId = req.query.venta_id;

  // Consulta SQL para obtener los detalles de la venta y los datos del producto asociado
  const query = `
    SELECT dv.detalle_id, dv.venta_id, dv.producto_id, dv.cantidad, dv.valor_total, p.nombre AS nombre_producto, p.precio_unitario AS precio_producto
    FROM Detalles_Venta dv
    JOIN Productos p ON dv.producto_id = p.producto_id
    WHERE dv.venta_id = ?`;

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
});

app.post("/ventas", (req, res) => {
  const { cliente_id } = req.body;

  // Insertar la venta en la tabla "Ventas"
  const insertVentaQuery =
    "INSERT INTO Ventas (cliente_id, fecha_hora, total) VALUES (?, NOW(), 0)";
  connection.query(insertVentaQuery, [cliente_id], (error, result) => {
    if (error) {
      console.error("Error al insertar la venta:", error);
      res.status(500).json({ error: "Error al insertar la venta" });
    } else {
      // Obtener el venta_id de la venta recién insertada
      const venta_id = result.insertId;

      // Insertar los detalles de la venta en la tabla "Detalles_Venta"
      const detallesVenta = req.body.detalles;
      const insertDetallesQuery =
        "INSERT INTO Detalles_Venta (venta_id, producto_id, cantidad, valor_total) VALUES (?, ?, ?, ?)";
      detallesVenta.forEach((detalle) => {
        const { producto_id, cantidad, valor_total } = detalle;
        connection.query(
          insertDetallesQuery,
          [venta_id, producto_id, cantidad, valor_total],
          (error) => {
            if (error) {
              console.error("Error al insertar detalle de venta:", error);
            }
          }
        );
      });

      // Calcular el total de la venta y actualizar la tabla "Ventas"
      const updateVentaQuery =
        "UPDATE Ventas SET total = (SELECT SUM(Productos.precio_unitario * Detalles_Venta.cantidad) FROM Productos JOIN Detalles_Venta ON Productos.producto_id = Detalles_Venta.producto_id WHERE Detalles_Venta.venta_id = ?) WHERE venta_id = ?";
      connection.query(updateVentaQuery, [venta_id, venta_id], (error) => {
        if (error) {
          console.error("Error al calcular el total de la venta:", error);
        } else {
          // Actualizar el estado de la mesa a "Disponible" en la tabla "Mesas"
          console.log(req.body.mesa_id);
          const mesa_id = req.body.mesa_id; // Suponiendo que recibes el ID de la mesa en el cuerpo de la solicitud
          console.log("vamos a agregar", mesa_id);
          const updateMesaQuery =
            "UPDATE Mesas SET estado = 'Disponible' WHERE mesa_id = ?";
          connection.query(updateMesaQuery, [mesa_id], (error) => {
            if (error) {
              console.error("Error al actualizar el estado de la mesa:", error);
            }
          });
          console.log("mesa actualizada");
        }
      });

      res.status(201).json({ message: "Nueva venta creada con éxito" });
    }
  });
});

// Resto del código del backend...

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: ", err);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
