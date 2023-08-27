import Box from "@mui/material/Box";

import { useState } from "react";
import Encabezado from "../ventas/Encabezado";
import TablaVentas from "./TablaVentas";
import Factura from "./Factura";

export default function Ventas() {
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [detalleVentas, setDetalleVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);

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

  return (
    <Box p={3}>
      <Encabezado
        formatNumber={formatNumber}
        setFilteredVentas={setFilteredVentas}
      ></Encabezado>

      <TablaVentas
        setSelectedVenta={setSelectedVenta}
        filteredVentas={filteredVentas}
        setOpenModal={setOpenModal}
        setDetalleVentas={setDetalleVentas}
        formatDateTime={formatDateTime}
        formatNumber={formatNumber}
      ></TablaVentas>

      <Factura
        selectedVenta={selectedVenta}
        setOpenModal={setOpenModal}
        openModal={openModal}
        formatDateTime={formatDateTime}
        detalleVentas={detalleVentas}
        formatNumber={formatNumber}
      ></Factura>
    </Box>
  );
}
