import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { styled } from "styled-components";
import PropTypes from "prop-types";
import RestarCantidad from "./RestarCantidad";

const DivCantidad = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const InputCantidad = styled.input`
  width: 30px;
  text-align: center;
  background: white;
  outline: none;
  color: black;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export default function CantidadProducto({
  selectedTable,
  setNuevo,
  producto,
  agregarProducto,
}) {
  const modificarCantidad = (producto, cantidad) => {
    const nuevaCantidad = cantidad;
    if (nuevaCantidad !== null) {
      axios
        .put(
          `http://localhost:3000/carrito_compras/${selectedTable}/${producto.producto_id}/actualizar_cantidad`,
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
    <DivCantidad>
      <RestarCantidad
        setNuevo={setNuevo}
        selectedTable={selectedTable}
        producto={producto}
      ></RestarCantidad>
      <InputCantidad
        type="tel"
        value={producto.cantidad === 0 ? "" : producto.cantidad}
        onChange={(e) => {
          const nuevaCantidad = parseInt(e.target.value, 10) || 0;
          setNuevo((prevAddProducto) =>
            prevAddProducto.map((pro) =>
              pro.producto_id === producto.producto_id
                ? { ...pro, cantidad: nuevaCantidad }
                : pro
            )
          );
          modificarCantidad(producto, nuevaCantidad);
        }}
      />
      <AddIcon
        color="success"
        sx={{ cursor: "pointer" }}
        onClick={() => agregarProducto(producto)}
      />
    </DivCantidad>
  );
}
CantidadProducto.propTypes = {
  selectedTable: PropTypes.number.isRequired,
  setNuevo: PropTypes.func.isRequired,
  producto: PropTypes.shape({
    producto_id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    cantidad: PropTypes.number.isRequired,
  }).isRequired,
  agregarProducto: PropTypes.func.isRequired,
};
