const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection
const connection = require("./db");

// Routes
app.use("/carrito_compras", require("./routes/carritoComprasRoutes.routes"));
app.use("/mesas", require("./routes/mesas.routes"));
app.use("/categorias", require("./routes/categorias.routes"));
app.use("/productos", require("./routes/productos.routes"));
app.use("/ventas", require("./routes/ventas.routes"));
app.use("/detalles_venta", require("./routes/detalles_venta.routes"));
app.use("/inventario", require("./routes/inventario.routes"));
app.use("/medios_de_pago", require("./routes/mediosPago.routes"));

// Start server
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
