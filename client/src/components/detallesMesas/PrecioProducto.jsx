import axios from "axios";
import PropTypes from "prop-types";
import { styled } from "styled-components";
import { localURL } from "../../conexion";

const InputPrecio = styled.input`
  width: 15%;
  text-align: center;
  background: white;
  outline: none;
  color: black;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export default function PrecioProducto({ selectedTable, setNuevo, producto }) {
  const modificarPrecio = (producto, precio) => {
    const nuevoPrecio = precio;
    if (nuevoPrecio !== null) {
      axios
        .put(
          `http://${localURL}:3000/carrito_compras/${selectedTable}/${producto.producto_id}/actualizar_precio`,
          {
            precio_venta: precio,
          }
        )
        .then(() => {
          // Actualizar el estado local con los datos actualizados de la API
          setNuevo((prevNuevo) =>
            prevNuevo.map((pro) =>
              pro.producto_id === producto.producto_id
                ? { ...pro, precio_venta: precio }
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
    <InputPrecio
      type="tel"
      value={producto.precio_venta !== undefined ? producto.precio_venta : ""}
      onChange={(e) => {
        const nuevoPrecio = parseInt(e.target.value);
        setNuevo((prevAddProducto) =>
          prevAddProducto.map((prod) =>
            prod.producto_id === producto.producto_id
              ? {
                  ...prod,
                  precio_venta: isNaN(nuevoPrecio) ? undefined : nuevoPrecio,
                }
              : prod
          )
        );
        modificarPrecio(producto, nuevoPrecio); // Enviar el producto con el precio cambiado como parámetro
      }}
    />
  );
}
PrecioProducto.propTypes = {
  setNuevo: PropTypes.func.isRequired,
  producto: PropTypes.shape({
    producto_id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    precio_venta: PropTypes.number,
  }).isRequired,
  selectedTable: PropTypes.number.isRequired,
};
