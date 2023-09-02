import { Paper } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Encabezado from "./Encabezado";
import Izquierdo from "./Izquierdo";
import Derecho from "./Derecho";
import { localURL } from "../../conexion";

const DivContenedor = styled.div`
  display: flex;
  gap: 10px;
  height: 80vh;

  @media (max-width: 768px) {
    flex-direction: row;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
  }
`;

const DivCentro = styled.div`
  width: 20%;
  height: 100%;
  background: #242424;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 5px;
  user-select: none;
  @media (max-width: 768px) {
    display: none;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
  }
`;

const Categorias = styled(Paper)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-grow: 1;
  font-weight: bold;
`;

export const Detalles = ({ idMesa }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [nuevo, setNuevo] = useState([]);
  const [selectedTable, setSelectedTable] = useState(idMesa);

  useEffect(() => {
    axios
      .get(`http://${localURL}:3000/categorias`)
      .then(({ data }) => {
        setCategorias(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleClick = (id) => {
    setCategoriaSeleccionada(id);
  };

  const obtenerProductosEnCarrito = useCallback(() => {
    axios
      .get(`http://${localURL}:3000/carrito_compras/${selectedTable}`)
      .then(({ data }) => {
        const productos = data.filter(({ cantidad }) => cantidad > 0);
        setNuevo(productos);
      })
      .catch((error) => {
        console.error("Error al obtener productos en carrito:", error);
      });
  }, [selectedTable]);

  useEffect(() => {
    obtenerProductosEnCarrito();
  }, [obtenerProductosEnCarrito]);

  const agregarProducto = (producto) => {
    // Realizar una solicitud GET a la API para obtener el producto en el carrito actual de la mesa
    axios
      .get(
        `http://${localURL}:3000/carrito_compras/existe/${selectedTable}/${producto.producto_id}`
      )
      .then(({ data }) => {
        const productoEnCarrito = data;

        if (productoEnCarrito) {
          console.log("existe");
          // Si el producto ya existe en el carrito, aumentar la cantidad en la API
          const nuevaCantidad = productoEnCarrito.cantidad + 1;
          console.log(nuevaCantidad);
          axios
            .put(
              `http://${localURL}:3000/carrito_compras/${selectedTable}/${producto.producto_id}/actualizar_cantidad`,
              {
                ...productoEnCarrito,
                cantidad: nuevaCantidad,
              }
            )
            .then(() => {
              // Actualizar el estado local con los datos actualizados de la API
              setNuevo((prevNuevo) =>
                prevNuevo.map((producto) =>
                  producto.producto_id === productoEnCarrito.producto_id
                    ? { ...producto, cantidad: nuevaCantidad }
                    : producto
                )
              );
              console.log("Cantidad de producto aumentada en el carrito.");
            })
            .catch((error) => {
              console.error(
                "Error al aumentar la cantidad del producto en el carrito:",
                error
              );
            });
        } else {
          // Si el producto no existe en el carrito, agregarlo al carrito en la API
          axios
            .post(`http://${localURL}:3000/carrito_compras`, {
              ...producto,
              mesa_id: selectedTable,
              cantidad: 1,
            })
            .then(() => {
              // Actualizar el estado local con los datos actualizados de la API
              setNuevo((prevNuevo) => [
                ...prevNuevo,
                { ...producto, cantidad: 1 },
              ]);
              console.log("Producto agregado al carrito.");
            })
            .catch((error) => {
              console.error("Error al agregar el producto al carrito:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error al obtener el producto en el carrito:", error);
      });
  };

  const formatNumber = (number) => {
    const optionsCOP = {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    };
    return number.toLocaleString("es-CO", optionsCOP);
  };

  return (
    <>
      <Encabezado
        setSelectedTable={setSelectedTable}
        selectedTable={selectedTable}
      ></Encabezado>
      <DivContenedor>
        <Izquierdo
          agregarProducto={agregarProducto}
          setNuevo={setNuevo}
          nuevo={nuevo}
          selectedTable={selectedTable}
          formatNumber={formatNumber}
          categorias={categorias}
          handleClick={handleClick}
          categoriaSeleccionada={categoriaSeleccionada}
        ></Izquierdo>

        <DivCentro>
          {categorias.map((cat, i) => (
            <Categorias key={i} onClick={() => handleClick(cat.categoria_id)}>
              {cat.nombre}
            </Categorias>
          ))}
        </DivCentro>

        <Derecho
          formatNumber={formatNumber}
          agregarProducto={agregarProducto}
          categoriaSeleccionada={categoriaSeleccionada}
        ></Derecho>
      </DivContenedor>
    </>
  );
};

Detalles.propTypes = {
  idMesa: PropTypes.number.isRequired,
};

export default Detalles;
