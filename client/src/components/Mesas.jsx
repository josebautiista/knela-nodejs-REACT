import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import Axios from "axios";
import Mesa from "./Mesa";
import { styled } from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";

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
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const añadirMesa = () => {
    setDialogOpen(true);
  };
  const confirmarAñadirMesa = () => {
    Axios.post("http://localhost:3000/mesas", {
      capacidad: 4,
      estado: "Disponible",
    })
      .then(() => {
        console.log("mesa agregada correctamente");
        handleCloseDialog(); // Cerrar la ventana de diálogo después de añadir la mesa
      })
      .catch((error) => {
        console.error("Error al crear la nueva mesa:", error);
        handleCloseDialog(); // Cerrar la ventana de diálogo en caso de error también
      });
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
      {mesas.map((mesa, index) => (
        <PaperMesa
          elevation={3}
          key={index} // Aquí está la clave correctamente aplicada
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
      ))}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
          >
            ¿Estás seguro de que deseas añadir una nueva mesa?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button onClick={handleCloseDialog} color="error" variant="contained">
            Cancelar
          </Button>
          <Button
            onClick={confirmarAñadirMesa}
            color="success"
            variant="contained"
            autoFocus
          >
            Añadir
          </Button>
        </DialogActions>
      </Dialog>

      <PaperMesa
        style={{
          justifyContent: "center",
          alignItems: "center",
          background: "#4a6f20",
        }}
      >
        <AddIcon
          sx={{
            width: "80%",
            height: "80%",
            color: "white",
            cursor: "pointer",
          }}
          onClick={añadirMesa}
        />
      </PaperMesa>
    </StyledBox>
  );
}
