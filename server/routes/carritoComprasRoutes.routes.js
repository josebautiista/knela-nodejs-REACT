const express = require("express");
const carritoComprasController = require("../controllers/carritoCompras.controller");
const router = express.Router();
router.put(
  "/:mesa_id/:producto_id/actualizar_cantidad",
  carritoComprasController.actualizarCantidad
);

router.put(
  "/:mesa_id/:producto_id/actualizar_precio",
  carritoComprasController.actualizarPrecio
);

router.get(
  "/existe/:mesa_id/:producto_id",
  carritoComprasController.getProductoExiste
);

router.get("/:mesa_id", carritoComprasController.getProductosEnCarrito);

router.post("/", carritoComprasController.agregarProductoAlCarrito);

router.delete(
  "/existe/:mesa_id/:producto_id",
  carritoComprasController.eliminarProductoDelCarrito
);

router.delete("/:mesa_id", carritoComprasController.vaciarCarrito);

router.put(
  "/cambiar_mesa/:mesaActual/:nuevaMesa",
  carritoComprasController.cambiarMesa
);

module.exports = router;
