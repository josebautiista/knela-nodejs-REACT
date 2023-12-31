import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { Paper } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { localURL } from "../../conexion";

const DivDerecho = styled.div`
  width: 40%;
  height: 100%;
  background: #242424;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 5px;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  user-select: none;
  @media (max-width: 768px) {
    display: none;
    width: 100%;
    justify-content: center;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
  }
`;

const ProductosAdd = styled(Paper)`
  width: 126px;
  height: 126px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

export default function Derecho({
  formatNumber,
  agregarProducto,
  categoriaSeleccionada,
}) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (categoriaSeleccionada) {
      axios
        .get(
          `http://${localURL}:3000/productos/categoria?id=${categoriaSeleccionada}`
        )
        .then(({ data }) => {
          const productos = data.map((producto) => ({
            ...producto,
            precio_venta: producto.precio_unitario,
          }));

          setProductos(productos);
        })
        .catch((error) => {
          console.error("Error al obtener datos de la API:", error);
        });
    }
  }, [categoriaSeleccionada]);

  return (
    <DivDerecho className="productos">
      {productos.map((producto, i) => (
        <ProductosAdd key={i} onClick={() => agregarProducto(producto)}>
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            {producto.nombre}
          </p>
          <span>{formatNumber(producto.precio_unitario)}</span>
        </ProductosAdd>
      ))}
    </DivDerecho>
  );
}

Derecho.propTypes = {
  formatNumber: PropTypes.func.isRequired,
  agregarProducto: PropTypes.func.isRequired,
  categoriaSeleccionada: PropTypes.any,
};
