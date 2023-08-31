import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const CambiarMesa = ({ setOpen, open, selectedTable, setSelectedTable }) => {
  const [newTable, setNewTable] = useState("");
  const [tableOptions, setTableOptions] = useState([]);

  const handleConfirm = () => {
    if (newTable) {
      axios
        .put(
          `http://localhost:3000/carrito_compras/cambiar_mesa/${selectedTable}/${newTable}`
        )
        .then(() => {
          setSelectedTable(newTable);
          handleClose();
        })
        .catch((error) => {
          console.error("Error transferring products:", error);
        });
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/mesas")
      .then((response) => {
        setTableOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching table options:", error);
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Cambiar mesa</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleccione a qué mesa desea cambiar:
        </DialogContentText>
        <FormControl fullWidth>
          <Select
            labelId="newTable-label"
            id="newTable"
            value={newTable}
            onChange={(e) => setNewTable(e.target.value)}
            autoFocus
          >
            {tableOptions
              .filter((table) => table.estado === "Disponible") // Filtrar las mesas con estado "Disponible"
              .map((table) => (
                <MenuItem key={table.mesa_id} value={table.mesa_id}>
                  Mesa {table.mesa_id}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="contained">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="success" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CambiarMesa.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedTable: PropTypes.number.isRequired,
  setSelectedTable: PropTypes.func.isRequired,
};

export default CambiarMesa;
