import { useState } from "react";
import { Button, Box, Modal } from "@mui/material";
import { Detalles } from "./detallesMesas/Detalles";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1100,
  bgcolor: "#242424",
  border: "none",
  boxShadow: 24,
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  pt: 2,
  px: 4,
  pb: 3,
};

export default function Mesa({ id }) {
  const [open, setOpen] = useState(false);
  const [addProducto, setAddProducto] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="success"
        sx={{ color: "black", fontWeight: "bold" }}
      >
        Detalles
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          {open && (
            <Detalles
              idMesa={id}
              addProducto={addProducto}
              setAddProducto={setAddProducto}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}
Mesa.propTypes = {
  id: PropTypes.number.isRequired,
};
