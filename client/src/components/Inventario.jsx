import { useEffect, useState } from "react";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

export default function Inventario() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Realizar la solicitud HTTP para obtener los datos de productos desde la API
    axios
      .get("http://localhost:3000/inventario") // Reemplaza la URL con la ruta de tu API
      .then((response) => {
        setProductos(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de productos:", error);
      });
  }, []);

  return (
    <div style={{ boxSizing: "border-box", padding: "0px 30px" }}>
      <Typography variant="h4" sx={{ margin: "20px" }}>
        Inventario
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID Producto</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Precio Unitario</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Cantidad Disponible
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.producto_id}>
                <TableCell>{producto.producto_id}</TableCell>
                <TableCell>{producto.nombre_producto}</TableCell>
                <TableCell>{producto.precio_unitario}</TableCell>
                <TableCell>{producto.cantidad_disponible}</TableCell>
                <TableCell>{producto.nombre_categoria}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
