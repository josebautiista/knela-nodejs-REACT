const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productos.controllers");

router.get("/categoria", productosController.getProductosPorCategoria);

module.exports = router;
