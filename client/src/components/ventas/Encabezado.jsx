import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

export default function Encabezado({ formatNumber, setFilteredVentas }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const utcOffset = -5; // UTC offset para Colombia
    const colombiaTime = new Date(now.getTime() + utcOffset * 60 * 60 * 1000);

    const year = colombiaTime.getUTCFullYear();
    const month = colombiaTime.getUTCMonth() + 1; // Los meses en JavaScript son 0-indexed
    const day = colombiaTime.getUTCDate();

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  });

  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  useEffect;
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

  const getUniqueVentas = (ventas, key) => {
    const uniqueVentasMap = new Map();
    ventas.forEach((venta) => {
      if (!uniqueVentasMap.has(venta[key])) {
        uniqueVentasMap.set(venta[key], venta);
      }
    });
    return Array.from(uniqueVentasMap.values());
  };

  const handleFilterVentas = () => {
    if (selectedDate) {
      const fecha = new Date(selectedDate).toISOString().slice(0, 10);

      axios
        .get(`http://localhost:3000/ventas/fecha?fecha=${fecha}`)
        .then((response) => {
          const filteredVentas = response.data;
          setFilteredVentas(filteredVentas);

          const totalVentas = filteredVentas.reduce(
            (total, venta) => total + venta.total,
            0
          );
          setTotalVentas(totalVentas);
        })
        .catch((error) => {
          console.error("Error al obtener las ventas:", error);
        });
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
  useEffect(() => {
    handleFilterVentas();
  }, []);

  return (
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
  );
}
Encabezado.propTypes = {
  formatNumber: PropTypes.func.isRequired,
  setFilteredVentas: PropTypes.func.isRequired,
};
