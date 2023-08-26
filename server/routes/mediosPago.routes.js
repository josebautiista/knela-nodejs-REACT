const express = require("express");
const router = express.Router();
const mediosDePagoController = require("../controllers/mediosDePago.controllers");

router.get("/", mediosDePagoController.getMediosDePago);

module.exports = router;
