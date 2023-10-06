import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";

const Test = ({ nuevo, open, setOpenTest }) => {
  const [productosPorPagar, setProductosPorPagar] = useState(
    JSON.parse(JSON.stringify(nuevo))
  );
  const [productosPagados, setProductosPagados] = useState([]);
  const [montoPagado, setMontoPagado] = useState(0);

  const handleDragStart = (e, producto) => {
    e.dataTransfer.setData("producto", JSON.stringify(producto));
  };

  useEffect(() => {
    setProductosPorPagar(JSON.parse(JSON.stringify(nuevo)));
  }, [nuevo]);

  const calcularMontoTotal = () => {
    const total = productosPagados.reduce((acc, producto) => {
      return acc + producto.precio_venta * producto.cantidad;
    }, 0);
    setMontoPagado(total);
  };

  useEffect(() => {
    calcularMontoTotal();
  }, [productosPagados]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Controlador de caída de elementos
  const handleDrop = (e, destino) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
    const producto = JSON.parse(e.dataTransfer.getData("producto")); // Obtener el producto arrastrado

    if (destino === "productosPorPagar") {
      // Comprobar si el destino es "productosPorPagar"
      const updatedProductosPagados = [...productosPagados]; // Clonar la lista actual de productosPagados
      const updatedProductosPorPagar = [...productosPorPagar]; // Clonar la lista actual de productosPorPagar

      // Encontrar el índice del producto en la lista de origen utilizando su producto_id
      const indexInPagados = updatedProductosPagados.findIndex(
        (p) => p.producto_id === producto.producto_id
      );

      if (indexInPagados !== -1) {
        // Si se encuentra el producto en la lista de productosPagados
        if (updatedProductosPagados[indexInPagados].cantidad > 1) {
          // Si la cantidad del producto es mayor que 1, reducir la cantidad en 1
          updatedProductosPagados[indexInPagados].cantidad -= 1;
        } else {
          // Si la cantidad es 1 o menos, eliminar el producto de la lista
          updatedProductosPagados.splice(indexInPagados, 1);
        }
      }

      // Encontrar el índice del producto en la lista de destino utilizando su producto_id
      const indexInPorPagar = updatedProductosPorPagar.findIndex(
        (p) => p.producto_id === producto.producto_id
      );

      if (indexInPorPagar !== -1) {
        // Si se encuentra el producto en la lista de productosPorPagar
        updatedProductosPorPagar[indexInPorPagar].cantidad += 1;
      } else {
        // Si no se encuentra el producto en la lista de productosPorPagar, agregarlo con cantidad 1
        const productoParaPagar = { ...producto }; // Clonar el producto arrastrado
        productoParaPagar.cantidad = 1; // Establecer la cantidad del producto en 1
        updatedProductosPorPagar.push(productoParaPagar);
      }

      // Actualizar los estados productosPagados y productosPorPagar con las listas actualizadas
      setProductosPagados(updatedProductosPagados);
      setProductosPorPagar(updatedProductosPorPagar);
    } else if (destino === "productosPagados") {
      // Comprobar si el destino es "productosPagados"
      const updatedProductosPagados = [...productosPagados]; // Clonar la lista actual de productosPagados
      const updatedProductosPorPagar = [...productosPorPagar]; // Clonar la lista actual de productosPorPagar

      // Encontrar el índice del producto en la lista de origen utilizando su producto_id
      const indexInPorPagar = updatedProductosPorPagar.findIndex(
        (p) => p.producto_id === producto.producto_id
      );

      if (indexInPorPagar !== -1) {
        // Si se encuentra el producto en la lista de productosPorPagar
        if (updatedProductosPorPagar[indexInPorPagar].cantidad > 1) {
          // Si la cantidad del producto es mayor que 1, reducir la cantidad en 1
          updatedProductosPorPagar[indexInPorPagar].cantidad -= 1;
        } else {
          // Si la cantidad es 1 o menos, eliminar el producto de la lista
          updatedProductosPorPagar.splice(indexInPorPagar, 1);
        }
      }

      // Encontrar el índice del producto en la lista de destino utilizando su producto_id
      const indexInPagados = updatedProductosPagados.findIndex(
        (p) => p.producto_id === producto.producto_id
      );

      if (indexInPagados !== -1) {
        // Si se encuentra el producto en la lista de productosPagados
        updatedProductosPagados[indexInPagados].cantidad += 1;
      } else {
        // Si no se encuentra el producto en la lista de productosPagados, agregarlo con cantidad 1
        const productoPagado = { ...producto }; // Clonar el producto arrastrado
        productoPagado.cantidad = 1; // Establecer la cantidad del producto en 1
        updatedProductosPagados.push(productoPagado);
      }

      // Actualizar los estados productosPagados y productosPorPagar con las listas actualizadas
      setProductosPagados(updatedProductosPagados);
      setProductosPorPagar(updatedProductosPorPagar);
    }
  };

  const finalizarDivision = () => {
    console.log("Productos Pagados:", productosPagados);
    console.log("Monto Pagado:", montoPagado);
  };

  const handleClose = () => {
    setOpenTest(false);
  };

  return (
    <Modal open={open} onClose={handleClose} sx={{ height: "90vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Paper sx={{ position: "relative", width: "80%", maxWidth: 600, p: 2 }}>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: "10px", right: "10px" }}
            aria-label="Cerrar"
          >
            {/* Ícono de cierre */}
          </IconButton>
          <Typography variant="h5">Dividir la Cuenta</Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "productosPorPagar")}
              style={{
                border: "1px solid #ccc",
                padding: 16,
                flex: 1,
                marginRight: 16,
                minHeight: 300,
              }}
            >
              <Typography variant="h6">Productos por Pagar</Typography>
              <List>
                {productosPorPagar.map((producto, i) => (
                  <ListItem
                    key={i}
                    draggable
                    onDragStart={(e) => handleDragStart(e, producto)}
                    style={{ margin: "8px 0", cursor: "pointer" }}
                  >
                    <ListItemText
                      primary={producto.nombre}
                      secondary={`Precio: $${producto.precio_venta} | Cantidad: ${producto.cantidad}`}
                    />
                  </ListItem>
                ))}
              </List>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "productosPagados")}
              style={{
                border: "1px solid #ccc",
                padding: 16,
                flex: 1,
                marginLeft: 16,
                minHeight: 300,
              }}
            >
              <Typography variant="h6">Productos Pagados</Typography>
              <List>
                {productosPagados.map((producto, i) => (
                  <ListItem
                    key={i}
                    draggable
                    onDragStart={(e) => handleDragStart(e, producto)}
                    style={{ margin: "8px 0", cursor: "pointer" }}
                  >
                    <ListItemText
                      primary={producto.nombre}
                      secondary={`Precio: $${producto.precio_venta} | Cantidad: ${producto.cantidad}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6">Monto Total: ${montoPagado}</Typography>
            </div>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={finalizarDivision}
          >
            Finalizar División
          </Button>
        </Paper>
      </Box>
    </Modal>
  );
};
export default Test;
