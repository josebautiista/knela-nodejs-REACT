import { Button, Typography } from "@mui/material";
import { useState } from "react";
import CambiarMesa from "./CambiarMesa";
import PropTypes from "prop-types";
import { styled } from "styled-components";

const DivContenedor = styled.div`
  text-align: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    /* Estilos para pantallas más pequeñas (móviles) */
    font-size: 10px;
  }
`;

const Encabezado = ({ setSelectedTable, selectedTable }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <DivContenedor>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "5px", fontSize: "2rem" }}
      >
        Mesa {selectedTable}
      </Typography>
      <Button variant="contained" color="success" onClick={handleClickOpen}>
        Cambiar mesa
      </Button>
      <CambiarMesa
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        open={open}
        setOpen={setOpen}
      />
    </DivContenedor>
  );
};

Encabezado.propTypes = {
  selectedTable: PropTypes.number.isRequired,
  setSelectedTable: PropTypes.func.isRequired,
};

export default Encabezado;
