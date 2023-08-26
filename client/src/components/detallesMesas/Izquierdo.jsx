import { Paper } from "@mui/material";
import { styled } from "styled-components";
import PropTypes from "prop-types";
import { useState } from "react";
import DetallesVenta from "./DetallesVenta";
import TotalPagar from "./TotalPagar";
import RegistrarVenta from "./RegistrarVenta";

const DivIzquierdo = styled.div`
  width: 40%;
  height: 100%;
  background-color: transparent;
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  user-select: none;
`;

export default function Izquierdo({
  agregarProducto,
  nuevo,
  selectedTable,
  setNuevo,
  formatNumber,
}) {
  const [montoPagado, setMontoPagado] = useState("");

  const total = nuevo
    .map(
      ({ precio_venta, precio_unitario, cantidad }) =>
        (precio_venta !== undefined ? precio_venta : precio_unitario) * cantidad
    )
    .reduce((total, valor) => total + valor, 0);

  return (
    <DivIzquierdo>
      <DetallesVenta
        nuevo={nuevo}
        selectedTable={selectedTable}
        setNuevo={setNuevo}
        agregarProducto={agregarProducto}
        formatNumber={formatNumber}
      ></DetallesVenta>

      <Paper
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <TotalPagar
          montoPagado={montoPagado}
          formatNumber={formatNumber}
          total={total}
        ></TotalPagar>

        <RegistrarVenta
          montoPagado={montoPagado}
          nuevo={nuevo}
          selectedTable={selectedTable}
          setNuevo={setNuevo}
          setMontoPagado={setMontoPagado}
          total={total}
          formatNumber={formatNumber}
        ></RegistrarVenta>
      </Paper>
    </DivIzquierdo>
  );
}
Izquierdo.propTypes = {
  agregarProducto: PropTypes.func.isRequired,
  nuevo: PropTypes.arrayOf(
    PropTypes.shape({
      producto_id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
      precio_venta: PropTypes.number,
    })
  ).isRequired,
  selectedTable: PropTypes.number.isRequired,
  setNuevo: PropTypes.func.isRequired,
  formatNumber: PropTypes.func.isRequired,
};
