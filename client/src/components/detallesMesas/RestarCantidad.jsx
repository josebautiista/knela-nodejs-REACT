import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import PropTypes from "prop-types";
import { localURL } from "../../conexion";

export default function RestarCantidad({ producto, setNuevo, selectedTable }) {
  const eliminarProductoCarrito = (productoId) => {
    axios
      .delete(
        `http://${localURL}:3000/carrito_compras/existe/${selectedTable}/${productoId}`
      )
      .then(() => {
        // Actualizar el estado local eliminando el producto con productoId
        setNuevo((prevNuevo) =>
          prevNuevo.filter((producto) => producto.producto_id !== productoId)
        );
        console.log("Producto eliminado del carrito en el backend.");
      })
      .catch((error) => {
        console.error("Error al eliminar el producto del carrito:", error);
      });
  };
  const restarCantidad = (producto) => {
    const nuevaCantidad = producto.cantidad - 1;
    if (nuevaCantidad <= 0) {
      // Si la cantidad llega a 0, eliminar el producto del carrito en el backend
      eliminarProductoCarrito(producto.producto_id);
    } else {
      // Si la cantidad es mayor a 0, actualizar la cantidad en el carrito mediante una solicitud PUT a la API
      axios
        .put(
          `http://${localURL}:3000/carrito_compras/${selectedTable}/${producto.producto_id}/actualizar_cantidad`,
          {
            cantidad: nuevaCantidad,
          }
        )
        .then(() => {
          // Actualizar el estado local con los datos actualizados de la API
          setNuevo((prevNuevo) =>
            prevNuevo.map((pro) =>
              pro.producto_id === producto.producto_id
                ? { ...pro, cantidad: nuevaCantidad }
                : pro
            )
          );
          console.log("Cantidad de producto restada en el carrito.");
        })
        .catch((error) => {
          console.error(
            "Error al restar la cantidad del producto en el carrito:",
            error
          );
        });
    }
  };
  return (
    <RemoveIcon
      color="error"
      sx={{ cursor: "pointer" }}
      onClick={() => restarCantidad(producto)}
    />
  );
}
RestarCantidad.propTypes = {
  producto: PropTypes.shape({
    producto_id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    cantidad: PropTypes.number.isRequired,
    // Otras propiedades si las hay
  }).isRequired,
  setNuevo: PropTypes.func.isRequired,
  selectedTable: PropTypes.number.isRequired,
};
