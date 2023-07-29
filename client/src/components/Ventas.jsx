import { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [detalleVentas, setDetalleVentas] = useState([]);

  useEffect(() => {
    // Realizar la solicitud HTTP para obtener los datos de ventas desde la API
    axios
      .get("http://localhost:3000/ventas")
      .then((response) => {
        // Filtrar las ventas duplicadas por su venta_id
        const uniqueVentas = getUniqueVentas(response.data, "venta_id");
        setVentas(uniqueVentas);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de ventas:", error);
      });
  }, []);

  // Función para filtrar ventas duplicadas por su venta_id
  const getUniqueVentas = (ventas, key) => {
    const uniqueVentasMap = new Map();
    ventas.forEach((venta) => {
      if (!uniqueVentasMap.has(venta[key])) {
        uniqueVentasMap.set(venta[key], venta);
      }
    });
    return Array.from(uniqueVentasMap.values());
  };

  // Función para abrir el modal y mostrar los detalles de la venta seleccionada
  const handleOpenModal = (venta) => {
    setSelectedVenta(venta);
    setOpenModal(true);

    axios
      .get(`http://localhost:3000/detalles_venta?venta_id=${venta.venta_id}`)
      .then((response) => {
        setDetalleVentas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles de la venta:", error);
      });
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toLocaleDateString("es-ES");
    const time = dateTime.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} ${time}`;
  };
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Ventas
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Venta</TableCell>
              <TableCell>Nombre Cliente</TableCell>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.map((venta, i) => (
              <TableRow
                key={i}
                sx={{ cursor: "pointer" }}
                onClick={() => handleOpenModal(venta)}
              >
                <TableCell>{venta.venta_id}</TableCell>
                <TableCell>{venta.nombre_cliente}</TableCell>
                <TableCell>{formatDateTime(venta.fecha_hora)}</TableCell>
                <TableCell>{venta.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para mostrar detalles de la venta seleccionada */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Detalles de la Venta</DialogTitle>
        <DialogContent className="detalles_venta">
          {/* Aquí puedes mostrar los detalles de la venta seleccionada */}
          {selectedVenta && (
            <div>
              <p>ID Venta: {selectedVenta.venta_id}</p>
              <p>ID Cliente: {selectedVenta.cliente_id}</p>
              <p>Nombre Cliente: {selectedVenta.nombre_cliente}</p>
              <p>Email Cliente: {selectedVenta.email_cliente}</p>
              <p>Telefono Cliente: {selectedVenta.telefono_cliente}</p>
              <p>Fecha y Hora: {formatDateTime(selectedVenta.fecha_hora)}</p>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio venta</TableCell>
                      <TableCell>Valor Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detalleVentas.map((detalle, index) => (
                      <TableRow key={index}>
                        <TableCell>{detalle.nombre_producto}</TableCell>
                        <TableCell>{detalle.cantidad}</TableCell>
                        <TableCell>{detalle.precio_venta}</TableCell>
                        <TableCell>{detalle.valor_total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <p>Total: {selectedVenta.total}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
