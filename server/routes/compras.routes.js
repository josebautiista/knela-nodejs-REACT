const express = require("express");
const router = express.Router();
const comprasController = require("../controllers/compras.controllers");

router.post("/", comprasController.createCompra);

module.exports = router;
