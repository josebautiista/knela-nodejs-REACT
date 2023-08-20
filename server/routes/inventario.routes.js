const express = require("express");
const router = express.Router();
const inventarioController = require("../controllers/inventario.controllers");

router.get("/", inventarioController.getInventario);

module.exports = router;
