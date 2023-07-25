import { useEffect, useState } from "react";
import { Button, Box, Modal } from "@mui/material";
import { Detalles } from "./Detalles";
import axios from "axios";

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
    // Primero, eliminar los productos asociados a la mesa de la base de datos
    eliminarProductosDeMesa()
      .then(() => {
        // Después de eliminar los productos, agregar los nuevos al carrito
        addProducto.forEach((producto) => {
          const carritoData = {
            mesa_id: id,
            producto_id: producto.producto_id,
            cantidad: producto.cantidad,
          };

          axios
            .post("http://localhost:3000/carrito_compras", carritoData)
            .then((response) => {
              console.log("Producto agregado al carrito:", response.data);
            })
            .catch((error) => {
              console.error("Error al agregar producto al carrito:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error al eliminar productos de la mesa:", error);
      });
  };

  const eliminarProductosDeMesa = () => {
    // Retorna una promesa que resuelve cuando se eliminan los productos
    return axios.delete(`http://localhost:3000/carrito_compras/${id}`);
  };

  useEffect(() => {
    obtenerProductosEnCarrito();
  }, [id]); // El useEffect se ejecutará cada vez que el ID de la mesa cambie

  const obtenerProductosEnCarrito = () => {
    axios
      .get(`http://localhost:3000/carrito_compras/${id}`)
      .then((response) => {
        console.log(response.data);
        // Actualizamos el estado addProducto con los productos obtenidos
        setAddProducto(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener productos en carrito:", error);
      });
  };

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
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}
