import { Container, Paper } from "@mui/material";
import { styled } from "styled-components";
import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { localURL } from "../../conexion";

const DivDerecho = styled.div`
  width: 40%;
  height: 60vh;
  background: #242424;
  box-sizing: border-box;
  align-content: flex-start;
  padding: 10px;
  border-radius: 5px;
  overflow-y: scroll;
  display: none;
  flex-wrap: wrap;
  gap: 10px;
  user-select: none;
  @media (max-width: 768px) {
    display: flex;
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

const DivCentro = styled.div`
  background: #242424;
  display: none;
  gap: 10px;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 5px;
  user-select: none;
  overflow-x: scroll;
  @media (max-width: 768px) {
    display: flex;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
  }
`;

const Categorias = styled(Paper)`
  width: auto;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  box-sizing: border-box;
  padding: 10px;
`;

function ResponsiveCatProd({
  categorias,
  handleClick,
  formatNumber,
  agregarProducto,
  categoriaSeleccionada,
  agregando,
  setAgregando,
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

  const handleRegresar = () => {
    // Establece agregando en false cuando se hace clic en el botón de regreso
    setAgregando(false);
  };

  return (
    <div
      style={{
        display: agregando ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      <svg
        onClick={handleRegresar}
        width="50px"
        height="50px"
        viewBox="0 0 72 72"
        id="emoji"
        xmlns="http://www.w3.org/2000/svg"
        fill="#002aff"
        stroke="#002aff"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <g id="color"></g> <g id="hair"></g> <g id="skin"></g>{" "}
          <g id="skin-shadow"></g>{" "}
          <g id="line">
            {" "}
            <polyline
              fill="none"
              stroke="#007bff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="2"
              points="46.1964,16.2048 26.8036,35.6651 46.1964,55.1254"
            ></polyline>{" "}
          </g>{" "}
        </g>
      </svg>
      <Container>
        <DivCentro className="catRes">
          {categorias.map((cat, i) => (
            <Categorias key={i} onClick={() => handleClick(cat.categoria_id)}>
              {cat.nombre}
            </Categorias>
          ))}
        </DivCentro>
      </Container>
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
    </div>
  );
}

export default ResponsiveCatProd;

ResponsiveCatProd.propTypes = {
  categorias: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired,
  formatNumber: PropTypes.func.isRequired,
  agregarProducto: PropTypes.func.isRequired,
  categoriaSeleccionada: PropTypes.number,
  agregando: PropTypes.bool.isRequired,
  setAgregando: PropTypes.func.isRequired,
};
