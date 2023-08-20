const express = require("express");
const router = express.Router();
const detallesVentaController = require("../controllers/detalles_venta.controllers");

// Definición de la ruta GET para obtener los detalles de una venta
router.get("/", detallesVentaController.getDetallesVenta);

module.exports = router;
