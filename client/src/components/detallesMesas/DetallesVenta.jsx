import styled from "@emotion/styled";
import { Paper } from "@mui/material";
import PropTypes from "prop-types";
import CantidadProducto from "./CantidadProducto";
import PrecioProducto from "./PrecioProducto";
import { useEffect } from "react";

const ContainerDetallesProductos = styled.div`
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-sizing: border-box;
  padding: 5px;
`;

const NombreColumnas = styled(Paper)`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
  font-weight: bold;
  gap: 10px;
  border: 1px solid #242424;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid #242424;
`;
const ProductoCarrito = styled(Paper)`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
  gap: 10px;
`;

export default function DetallesVenta({
  nuevo,
  selectedTable,
  setNuevo,
  agregarProducto,
  formatNumber,
}) {
  useEffect(() => {
    const container = document.querySelector(".add-producto");
    if (container) {
      container.scrollTop = container.scrollHeight; // Desplaza el contenedor hacia abajo
    }
  }, [nuevo]);
  return (
    <>
      <NombreColumnas>
        <div style={{ flexBasis: "50%" }}>Producto</div>
        <div style={{ flexBasis: "30%" }}>Cantidad</div>
        <div style={{ flexBasis: "28%" }}>Unidad</div>
        <div style={{ flexBasis: "18%" }}>Valor</div>
      </NombreColumnas>
      <ContainerDetallesProductos className="add-producto">
        {nuevo.map((producto, i) => (
          <ProductoCarrito key={i}>
            <div style={{ width: "40%" }}>{producto.nombre}</div>
            <CantidadProducto
              selectedTable={selectedTable}
              setNuevo={setNuevo}
              producto={producto}
              agregarProducto={agregarProducto}
            ></CantidadProducto>

            <PrecioProducto
              producto={producto}
              setNuevo={setNuevo}
              selectedTable={selectedTable}
            ></PrecioProducto>

            <p style={{ width: "20%" }}>
              {formatNumber(producto.precio_venta * producto.cantidad || 0)}
            </p>
          </ProductoCarrito>
        ))}
      </ContainerDetallesProductos>
    </>
  );
}
DetallesVenta.propTypes = {
  nuevo: PropTypes.arrayOf(
    PropTypes.shape({
      producto_id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
      precio_venta: PropTypes.number,
    })
  ).isRequired,
  selectedTable: PropTypes.number.isRequired,
  setNuevo: PropTypes.func.isRequired,
  agregarProducto: PropTypes.func.isRequired,
  formatNumber: PropTypes.func.isRequired,
};
