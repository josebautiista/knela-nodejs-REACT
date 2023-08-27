const express = require("express");
const router = express.Router();
const inventarioController = require("../controllers/inventario.controllers");

router.get("/", inventarioController.getInventario);
router.post("/", inventarioController.crearInventario);
router.get(
  "/verificar-inventario/:fecha",
  inventarioController.verificarInventarioPorFecha
);
router.get("/fecha/:fecha", inventarioController.obtenerProductosPorFecha);

module.exports = router;
