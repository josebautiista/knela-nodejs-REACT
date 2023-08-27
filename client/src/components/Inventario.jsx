import { useEffect, useState } from "react";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import { Button, Typography } from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import TextField from "@mui/material/TextField";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [orderBy, setOrderBy] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const utcOffset = -5; // UTC offset para Colombia
    const colombiaTime = new Date(now.getTime() + utcOffset * 60 * 60 * 1000);

    const year = colombiaTime.getUTCFullYear();
    const month = colombiaTime.getUTCMonth() + 1; // Los meses en JavaScript son 0-indexed
    const day = colombiaTime.getUTCDate();

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  });

  useEffect(() => {
    // Realizar la solicitud HTTP para obtener los datos de productos desde la API
    axios
      .get("http://localhost:3000/inventario") // Reemplaza la URL con la ruta de tu API
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de productos:", error);
      });
  }, []);

  function obtenerFechaColombia() {
    const now = new Date();
    const utcOffset = -5; // UTC offset para Colombia
    const colombiaTime = new Date(now.getTime() + utcOffset * 60 * 60 * 1000);

    const year = colombiaTime.getUTCFullYear();
    const month = colombiaTime.getUTCMonth() + 1; // Los meses en JavaScript son 0-indexed
    const day = colombiaTime.getUTCDate();

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  }

  function crearInventarioAutomaticamente() {
    const fechaColombia = obtenerFechaColombia();
    axios
      .get(
        `http://localhost:3000/inventario/verificar-inventario/${fechaColombia}`
      )
      .then((response) => {
        const inventarioExistente = response.data.inventarioExistente;
        if (!inventarioExistente) {
          // Crear un nuevo inventario si no existe
          axios
            .post("http://localhost:3000/inventario", {})
            .then(() => {
              console.log("Inventario creado exitosamente.");
            })
            .catch((error) => {
              console.error("Error al crear el inventario:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error al verificar el inventario:", error);
      });
  }

  const sortedProductos = productos.slice().sort((a, b) => {
    if (orderBy === "nombre_ingrediente") {
      return orderDirection === "asc"
        ? a.nombre_ingrediente.localeCompare(b.nombre_ingrediente)
        : b.nombre_ingrediente.localeCompare(a.nombre_ingrediente);
    } else if (orderBy === "precio_compra") {
      return orderDirection === "asc"
        ? a.precio_compra - b.precio_compra
        : b.precio_compra - a.precio_compra;
    }
    return 0;
  });

  const handleSort = (column) => {
    if (column === orderBy) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(column);
      setOrderDirection("asc");
    }
  };

  const handleFilterInventario = () => {
    if (selectedDate) {
      axios
        .get(`http://localhost:3000/inventario/fecha/${selectedDate}`)
        .then((response) => {
          setProductos(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos de inventario:", error);
        });
    } else {
      // Si no hay una fecha seleccionada, muestra todos los inventarios
      axios
        .get("http://localhost:3000/inventario")
        .then((response) => {
          setProductos(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos de productos:", error);
        });
    }
  };

  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: "10px 30px 30px 30px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h4" sx={{ margin: "20px" }}>
          Inventario
        </Typography>
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            boxSizing: "border-box",
            padding: "10px",
            background: "white",
            borderRadius: "5px",
          }}
        >
          {/* Campo de entrada tipo fecha */}
          <TextField
            label="Filtrar por fecha"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              style: { color: "black" },
            }}
            InputProps={{ style: { colorScheme: "none" } }}
          />

          {/* Botón para realizar la búsqueda */}
          <Button
            color="primary"
            size="medium"
            variant="contained"
            onClick={handleFilterInventario}
            sx={{ height: "70%" }}
          >
            Buscar
          </Button>
        </div>
        <Button
          color="info"
          variant="contained"
          size="small"
          onClick={crearInventarioAutomaticamente}
          style={{ height: "50px" }} // Agrega este estilo para ajustar la altura automáticamente
        >
          Crear Inventario
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("inventario_id")}
              >
                <p>Inventario ID</p>{" "}
                <ImportExportIcon color="primary" fontSize="small" />
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("fecha")}
              >
                <p>Fecha</p>{" "}
                <ImportExportIcon color="primary" fontSize="small" />
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("ingrediente_id")}
              >
                <p>ID Ingrediente</p>{" "}
                <ImportExportIcon color="primary" fontSize="small" />
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("nombre_ingrediente")}
              >
                <p>Nombre Ingrediente</p>{" "}
                <ImportExportIcon color="primary" fontSize="small" />
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("cantidad_detalle")}
              >
                <p>Cantidad Inicial</p>{" "}
                <ImportExportIcon color="primary" fontSize="small" />
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("cantidad_ingrediente")}
              >
                <p>Cantidad Actual</p>{" "}
                <ImportExportIcon color="primary" fontSize="small" />
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("unidad_medida")}
              >
                <p>Unidad Medida</p>{" "}
                <ImportExportIcon color="primary" fontSize="small" />
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("precio_compra")}
              >
                <p>Precio Compra</p>{" "}
                <ImportExportIcon color="primary" fontSize="small" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProductos.map((producto) => (
              <TableRow key={producto.detalle_id}>
                <TableCell style={{ textAlign: "center" }}>
                  {producto.inventario_id}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {new Date(producto.fecha).toLocaleDateString()}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {producto.ingrediente_id}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {producto.nombre_ingrediente}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {producto.cantidad_detalle}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {producto.cantidad_ingrediente}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {producto.unidad_medida}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {producto.precio_compra}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
