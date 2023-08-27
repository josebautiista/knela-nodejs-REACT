import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import axios from "axios";
import PropTypes from "prop-types";

export default function TablaVentas({
  setOpenModal,
  setSelectedVenta,
  filteredVentas,
  setDetalleVentas,
  formatDateTime,
  formatNumber,
}) {
  const handleOpenModal = (venta) => {
    setSelectedVenta(venta);
    setOpenModal(true);

    axios
      .get(`http://localhost:3000/detalles_venta?venta_id=${venta.venta_id}`)
      .then((response) => {
        setDetalleVentas(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles de la venta:", error);
      });
  };
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              ID Venta
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              Nombre Cliente
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              Fecha y Hora
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              Total
            </TableCell>
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
  );
}
TablaVentas.propTypes = {
  setOpenModal: PropTypes.func.isRequired,
  setSelectedVenta: PropTypes.func.isRequired,
  filteredVentas: PropTypes.array.isRequired,
  setDetalleVentas: PropTypes.func.isRequired,
  formatDateTime: PropTypes.func.isRequired,
  formatNumber: PropTypes.func.isRequired,
};
