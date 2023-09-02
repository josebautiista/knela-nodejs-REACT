import { useState } from "react";
import { Button, Box, Modal, IconButton } from "@mui/material";
import { Detalles } from "./detallesMesas/Detalles";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95vw",
  bgcolor: "#242424",
  border: "none",
  boxShadow: 24,
  height: "90vh",
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
        <Box sx={{ ...style, paddingRight: "0px", paddingLeft: "0px" }}>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: "10px", right: "10px" }} // Posiciona el botón de cierre
            aria-label="Cerrar"
          >
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#ff0000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                  stroke="#ff0000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                  stroke="#ff0000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
              </g>
            </svg>
          </IconButton>
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
