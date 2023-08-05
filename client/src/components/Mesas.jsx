import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import Axios from "axios";
import Mesa from "./Mesa";
import { styled } from "styled-components";

const StyledBox = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 100px;
  color: "white";

  & > :not(style) {
    width: 250px;
    height: 250px;
    margin: 5px;
  }
`;

const PaperMesa = styled(Paper)`
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    // Función para obtener las mesas desde el servidor
    const getMesas = () => {
      Axios.get("http://localhost:3000/mesas").then((response) => {
        setMesas(response.data);
      });
    };

    // Obtener las mesas al montar el componente
    getMesas();

    // Configurar la función de polling para obtener las mesas cada 5 segundos
    const interval = setInterval(getMesas, 100);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <StyledBox>
      {mesas.map((mesa, index) => {
        return (
          <PaperMesa
            elevation={3}
            key={index}
            sx={{
              backgroundColor:
                mesa.estado === "Disponible" ? "#4a6f20" : "#7b1104",
            }}
            onClick={handleOpen}
          >
            <Typography variant="h5" sx={{ color: "black" }}>
              Mesa {mesa.mesa_id}
            </Typography>
            <Mesa open={open} setOpen={setOpen} id={mesa.mesa_id} />
          </PaperMesa>
        );
      })}
    </StyledBox>
  );
}
