const express = require("express");
const mesasController = require("../controllers/mesas.controllers");
const router = express.Router();

router.get("/", mesasController.getMesas);
router.post("/", mesasController.crearMesa);

module.exports = router;
