import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import Axios from "axios";
import Mesa from "./Mesa";

export default function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    Axios.get("http://localhost:3000/mesas").then((response) => {
      setMesas(response.data.map((mesa) => mesa.mesa_id));
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        "& > :not(style)": {
          m: 1,
          width: 250,
          height: 250,
        },
      }}
    >
      {mesas.map((mesa, index) => {
        return (
          <Paper
            elevation={3}
            key={index}
            sx={{
              boxSizing: "border-box",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            onClick={handleOpen}
          >
            <Typography variant="h5" sx={{ color: "black" }}>
              Mesa {mesa}
            </Typography>
            <Mesa open={open} setOpen={setOpen} id={mesa} />
          </Paper>
        );
      })}
    </Box>
  );
}
