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
import TextField from "@mui/material/TextField"; // Importa el componente TextField
import { useEffect, useState } from "react";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [detalleVentas, setDetalleVentas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10); // Formato AAAA-MM-DD
  });
  const [filteredVentas, setFilteredVentas] = useState([]); // Estado para almacenar las ventas filtradas
  const [totalVentas, setTotalVentas] = useState(0); // Estado para almacenar el total de las ventas filtradas

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

  // Función para filtrar las ventas por fecha y calcular el total de las ventas filtradas
  const handleFilterVentas = () => {
    if (selectedDate) {
      const fecha = new Date(selectedDate).toISOString().slice(0, 10);
      const filteredVentas = ventas.filter((venta) => {
        const ventaDate = new Date(venta.fecha_hora).toISOString().slice(0, 10);
        console.log(ventaDate, fecha);
        return ventaDate === fecha;
      });

      console.log(filteredVentas);
      setFilteredVentas(filteredVentas);

      const totalVentas = filteredVentas.reduce(
        (total, venta) => total + venta.total,
        0
      );
      setTotalVentas(totalVentas);
    } else {
      // Si no hay una fecha seleccionada, muestra todas las ventas
      setFilteredVentas(ventas);
      const totalVentas = ventas.reduce(
        (total, venta) => total + venta.total,
        0
      );
      setTotalVentas(totalVentas);
    }
  };

  return (
    <Box p={3}>
      <div style={{ display: "flex", gap: "100px", margin: "30px" }}>
        <Typography variant="h5" gutterBottom>
          Ventas
        </Typography>

        {/* Campo de entrada tipo fecha */}
        <TextField
          label="Filtrar por fecha"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Botón para realizar la búsqueda */}
        <Button variant="contained" onClick={handleFilterVentas}>
          Buscar Ventas
        </Button>
      </div>

      {/* Tabla de ventas */}
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
            {filteredVentas.map((venta, i) => (
              <TableRow
                key={i}
                sx={{ cursor: "pointer" }}
                onClick={() => handleOpenModal(venta)}
              >
                <TableCell>{venta.venta_id}</TableCell>
                <TableCell>{venta.nombre_cliente}</TableCell>
                <TableCell>{formatDateTime(venta.fecha_hora)}</TableCell>
                <TableCell>{formatNumber(venta.total)}</TableCell>
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
                        <TableCell>
                          {formatNumber(detalle.precio_venta)}
                        </TableCell>
                        <TableCell>
                          {formatNumber(detalle.valor_total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <p>Total: {formatNumber(selectedVenta.total)}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Total de las ventas filtradas */}
      <Typography variant="h6">Total Ventas:</Typography>
      <Typography variant="subtitle1">{formatNumber(totalVentas)}</Typography>
    </Box>
  );
}
