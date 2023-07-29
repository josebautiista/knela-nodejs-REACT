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

        // Mostrar todas las ventas al cargar el componente
        handleFilterVentas();
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
        return ventaDate === fecha;
      });

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "30px",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Ventas</Typography>
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            boxSizing: "border-box",
            padding: "10px",
            background: "white",
            borderRadius: "5px",
          }}
        >
          {/* Campo de entrada tipo fecha */}
          <TextField
            label="Filtrar por fecha"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              style: { color: "black" },
            }}
            InputProps={{ style: { colorScheme: "none" } }}
          />

          {/* Botón para realizar la búsqueda */}
          <Button
            color="primary"
            size="medium"
            variant="contained"
            onClick={handleFilterVentas}
            sx={{ height: "70%" }}
          >
            Buscar
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            AlignItems: "center",
            gap: "10px",
            width: "40%",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4">Total Ventas:</Typography>
          <Typography variant="h4">{formatNumber(totalVentas)}</Typography>
        </div>
      </div>

      {/* Tabla de ventas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID Venta</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha y Hora</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
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
    </Box>
  );
}
