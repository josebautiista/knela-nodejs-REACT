import { Button, Typography } from "@mui/material";
import { useState } from "react";
import CambiarMesa from "./CambiarMesa";
import PropTypes from "prop-types";
import { styled } from "styled-components";
import Test from "../../Test";

const DivContenedor = styled.div`
  text-align: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    /* Estilos para pantallas más pequeñas (móviles) */
    font-size: 10px;
  }
`;

const Encabezado = ({ setSelectedTable, selectedTable, nuevo }) => {
  const [openCambiarMesa, setOpenCambiarMesa] = useState(false);
  const [openTest, setOpenTest] = useState(false);

  const handleOpenTestModal = () => {
    setOpenTest(true);
  };

  // Función para abrir el modal de CambiarMesa
  const handleOpenCambiarMesaModal = () => {
    setOpenCambiarMesa(true);
  };

  return (
    <DivContenedor>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "5px", fontSize: "2rem" }}
      >
        Mesa {selectedTable}
      </Typography>
      <Button
        variant="contained"
        color="success"
        onClick={handleOpenCambiarMesaModal}
      >
        Cambiar mesa
      </Button>
      <Button variant="contained" color="success" onClick={handleOpenTestModal}>
        Dividir Cuenta
      </Button>
      {/* Renderiza el componente Test y pasa las propiedades correctamente */}
      <Test open={openTest} nuevo={nuevo} setOpenTest={setOpenTest} />

      {/* Renderiza el componente CambiarMesa y pasa la prop openCambiarMesa */}
      <CambiarMesa
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        open={openCambiarMesa}
        setOpen={setOpenCambiarMesa}
      />
    </DivContenedor>
  );
};

Encabezado.propTypes = {
  selectedTable: PropTypes.number.isRequired,
  setSelectedTable: PropTypes.func.isRequired,
};

export default Encabezado;
