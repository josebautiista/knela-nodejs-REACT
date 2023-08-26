import { Button, Typography } from "@mui/material";
import { useState } from "react";
import CambiarMesa from "./CambiarMesa";
import PropTypes from "prop-types";

export default function Encabezado({ setSelectedTable, selectedTable }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "10px" }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "20px" }}
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
      ></CambiarMesa>
    </div>
  );
}
Encabezado.propTypes = {
  selectedTable: PropTypes.number.isRequired,
  setSelectedTable: PropTypes.func.isRequired,
};
