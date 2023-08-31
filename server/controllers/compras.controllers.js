const connection = require("../db");

exports.createCompra = (req, res) => {
  const {
    numero_factura,
    ingrediente_id,
    cantidad,
    fecha,
    metodo_pago,
    total_pago,
  } = req.body;

  const sqlInsert = `
    INSERT INTO compras (numero_factura, ingrediente_id, cantidad, fecha, metodo_pago_id, total_pago)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const sqlUpdateCantidad = `
    UPDATE ingredientes
    SET cantidad = cantidad + ?
    WHERE ingrediente_id = ?
  `;

  connection.beginTransaction((err) => {
    if (err) {
      console.error("Error al iniciar la transacción:", err);
      res.status(500).json({ error: "Error al iniciar la transacción" });
      return;
    }

    connection.query(
      sqlInsert,
      [
        numero_factura,
        ingrediente_id,
        cantidad,
        fecha,
        metodo_pago,
        total_pago,
      ],
      (err, result) => {
        if (err) {
          console.error("Error al crear la compra:", err);
          connection.rollback(() => {
            res.status(500).json({ error: "Error al crear la compra" });
          });
          return;
        }

        connection.query(
          sqlUpdateCantidad,
          [cantidad, ingrediente_id],
          (err, result) => {
            if (err) {
              console.error(
                "Error al actualizar la cantidad del ingrediente:",
                err
              );
              connection.rollback(() => {
                res
                  .status(500)
                  .json({
                    error: "Error al actualizar la cantidad del ingrediente",
                  });
              });
            } else {
              connection.commit((err) => {
                if (err) {
                  console.error("Error al confirmar la transacción:", err);
                  connection.rollback(() => {
                    res
                      .status(500)
                      .json({ error: "Error al confirmar la transacción" });
                  });
                } else {
                  res
                    .status(201)
                    .json({ message: "Compra creada exitosamente" });
                }
              });
            }
          }
        );
      }
    );
  });
};
