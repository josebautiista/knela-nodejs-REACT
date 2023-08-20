const express = require("express");
const ventasController = require("../controllers/ventas.controllers");

const router = express.Router();

router.get("/", ventasController.getVentas);
router.post("/", ventasController.crearVenta);

module.exports = router;
