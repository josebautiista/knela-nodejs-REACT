import { useCallback, useEffect, useState } from "react";
import { Button, Box, Modal } from "@mui/material";
import { Detalles } from "./Detalles";
import axios from "axios";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1100,
  bgcolor: "#242424",
  border: "none",
  boxShadow: 24,
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  pt: 2,
  px: 4,
  pb: 3,
};

export default function Mesa({ id }) {
  const [open, setOpen] = useState(false);
  const [addProducto, setAddProducto] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    agregarProductosAlCarrito();
  };
  const agregarProductosAlCarrito = () => {
    eliminarProductosDeMesa()
      .then(() => {
        // Después de eliminar los productos, agregar los nuevos al carrito
        return Promise.all(
          addProducto.map((producto) => {
            const carritoData = {
              mesa_id: id,
              producto_id: producto.producto_id,
              cantidad: producto.cantidad,
              precio_venta: producto.precio_venta,
            };
            return axios.post(
              "http://localhost:3000/carrito_compras",
              carritoData
            );
          })
        );
      })
      .then((responses) => {
        responses.forEach((response) => {
          console.log("Producto agregado al carrito:", response.data);
        });
      })
      .catch((error) => {
        console.error(
          "Error al eliminar productos de la mesa o agregar al carrito:",
          error
        );
      });
  };

  const eliminarProductosDeMesa = () => {
    return axios.delete(`http://localhost:3000/carrito_compras/${id}`);
  };

  const obtenerProductosEnCarrito = useCallback(() => {
    axios
      .get(`http://localhost:3000/carrito_compras/${id}`)
      .then((response) => {
        const productos = response.data.map((producto) => ({
          ...producto,
          precio_venta: producto.precio_unitario,
        }));

        setAddProducto(productos);
      })
      .catch((error) => {
        console.error("Error al obtener productos en carrito:", error);
      });
  }, [id]);

  useEffect(() => {
    obtenerProductosEnCarrito();
  }, [id, obtenerProductosEnCarrito]);

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="inherit">
        Detalles
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          {open && (
            <Detalles
              idMesa={id}
              addProducto={addProducto}
              setAddProducto={setAddProducto}
              eliminarProductosDeMesa={eliminarProductosDeMesa}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}
Mesa.propTypes = {
  id: PropTypes.number.isRequired,
};
