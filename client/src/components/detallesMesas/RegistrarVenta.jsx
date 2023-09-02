import { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import PropTypes from "prop-types";
import MuiAlert from "@mui/material/Alert";
import { localURL } from "../../conexion";
import { styled } from "styled-components";

const DivContenedor = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    width: 80%;
    gap: 5px;
  }
`;

const RTextField = styled(TextField)`
  margin-bottom: 10px;

  @media (max-width: 768px) {
    /* Estilos para pantallas más pequeñas (móviles) */
  }
`;

export default function RegistrarVenta({
  setNuevo,
  selectedTable,
  nuevo,
  montoPagado,
  setMontoPagado,
  total,
  formatNumber,
}) {
  const [selectedMedioPago, setSelectedMedioPago] = useState("");
  const [medioPagoValido, setMedioPagoValido] = useState(false);
  const [mediosDePago, setMediosDePago] = useState([]);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`http://${localURL}:3000/medios_de_pago`)
      .then((response) => {
        setMediosDePago(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los medios de pago:", error);
      });
  }, []);

  const handleMedioPagoChange = (event) => {
    setSelectedMedioPago(event.target.value);
    setMedioPagoValido(event.target.value !== "");
  };

  const handleConfirmDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDialogConfirm = () => {
    setIsDialogOpen(false);
    registrarVenta();
  };

  const registrarVenta = () => {
    const cantidadPago =
      montoPagado !== "" ? parseFloat(montoPagado.replace(/\./g, "")) : 0;
    const nuevaVenta = {
      cliente_id: 1,
      detalles: nuevo.map(
        ({ producto_id, nombre, cantidad, precio_venta }) => ({
          producto_id,
          nombre_producto: nombre,
          cantidad,
          precio_venta,
          valor_total: precio_venta * cantidad,
        })
      ),
      medio_pago_id: selectedMedioPago,
      cantidad_pago: cantidadPago,
      mesa_id: selectedTable,
    };

    axios
      .post(`http://${localURL}:3000/ventas`, nuevaVenta)
      .then(() => {
        axios
          .delete(`http://${localURL}:3000/carrito_compras/${selectedTable}`)
          .then(() => {
            setNuevo([]);
            setSelectedMedioPago("");
            setMontoPagado("");
            setIsSnackbarOpen(true);
            setMedioPagoValido(false);
          })
          .catch((error) => {
            console.error("Error al vaciar el carrito:", error);
          });
      })
      .catch((error) => {
        console.error("Error al crear la nueva venta:", error);
      });
  };

  const handleMontoPagadoChange = ({ target }) => {
    const { value } = target;
    const formattedValue = value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setMontoPagado(formattedValue);
  };

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const parsedMontoPagado =
    montoPagado !== "" ? parseFloat(montoPagado.replace(/\./g, "")) : 0;
  const diferencia = parsedMontoPagado - total;

  return (
    <DivContenedor>
      <RTextField
        select
        label="Medio de Pago"
        value={selectedMedioPago}
        onChange={handleMedioPagoChange}
        size="small"
      >
        {mediosDePago.map(({ id, nombre }) => (
          <MenuItem key={id} value={id}>
            {nombre}
          </MenuItem>
        ))}
      </RTextField>

      <TextField
        label="Recibido"
        value={montoPagado}
        onChange={handleMontoPagadoChange}
        type="text"
        style={{ marginBottom: "10px" }}
        size="small"
      />
      <Button
        color="success"
        size="large"
        variant="contained"
        onClick={handleConfirmDialogOpen}
        disabled={!medioPagoValido}
      >
        Cobrar
      </Button>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={handleCloseSnackbar}
        >
          Venta realizada correctamente
        </MuiAlert>
      </Snackbar>

      <Dialog open={isDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Confirmar Venta
        </DialogTitle>
        <DialogContent>
          <h1>Total: {formatNumber(total)}</h1>
          <h2>
            Recibido:{" "}
            {formatNumber(parseFloat(montoPagado.replace(/\./g, "")) || 0)}
          </h2>
          <h3>Cambio: {formatNumber(diferencia > 0 ? diferencia : 0)}</h3>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmDialogClose}
            color="error"
            variant="contained"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDialogConfirm}
            color="success"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </DivContenedor>
  );
}

RegistrarVenta.propTypes = {
  setNuevo: PropTypes.func.isRequired,
  selectedTable: PropTypes.number.isRequired,
  nuevo: PropTypes.array.isRequired,
  montoPagado: PropTypes.string.isRequired,
  setMontoPagado: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  formatNumber: PropTypes.func.isRequired,
};
