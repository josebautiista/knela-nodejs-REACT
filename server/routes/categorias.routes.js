const express = require("express");
const categoriasController = require("../controllers/categorias.controllers");
const router = express.Router();

router.get("/", categoriasController.getCategorias);

module.exports = router;
