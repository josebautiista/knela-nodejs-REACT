import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

function IngredientManagement() {
  const [ingredients, setIngredients] = useState([]);
  const [factura, setFactura] = useState("");
  const [ingrediente, setIngrediente] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [totalPago, setTotalPago] = useState(0);
  const [fechaCompra, setFechaCompra] = useState("");
  const [precioCompra, setPrecioCompra] = useState(0);
  const [mediosDePago, setMediosDePago] = useState([]);
  const [selectedMedioPago, setSelectedMedioPago] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/medios_de_pago")
      .then((response) => {
        setMediosDePago(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los medios de pago:", error);
      });
  }, []);

  useEffect(() => {
    // Hacer una solicitud GET al backend para obtener los ingredientes
    axios
      .get("http://localhost:3000/inventario/ingredientes")
      .then((response) => {
        setIngredients(response.data);
        console.log(response.data);
      });
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes enviar los datos de la compra al backend
    const compraData = {
      ingrediente_id: ingrediente,
      numero_factura: factura,
      producto: ingrediente,
      cantidad: cantidad,
      fecha: fechaCompra,
      metodo_pago: selectedMedioPago,
      total_pago: totalPago,
    };
    console.log(compraData);

    axios
      .post("http://localhost:3000/compras", compraData)
      .then((response) => {
        console.log("Compra creada:", response.data);
        // Restablecer los estados a sus valores iniciales para limpiar los campos
        setFactura("");
        setIngrediente("");
        setCantidad(0);
        setTotalPago(0);
        setFechaCompra("");
        setPrecioCompra(0);
        setSelectedMedioPago("");
      })
      .catch((error) => {
        console.error("Error al crear la compra:", error);
      });
  };

  const handleCantidadChange = (event) => {
    const newCantidad = event.target.value;
    setCantidad(newCantidad);
    calculatePrecioCompra(totalPago, newCantidad);
  };

  const handleTotalPagoChange = (event) => {
    const newTotalPago = event.target.value;
    setTotalPago(newTotalPago);
    calculatePrecioCompra(newTotalPago, cantidad);
  };

  const calculatePrecioCompra = (newTotalPago, newCantidad) => {
    if (newCantidad !== 0) {
      const newPrecioCompra = newTotalPago / newCantidad;
      setPrecioCompra(newPrecioCompra);
    } else {
      setPrecioCompra(0);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
        <Typography variant="h5" gutterBottom>
          Registrar una compra
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Número de Factura"
            value={factura}
            onChange={(e) => setFactura(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Producto</InputLabel>
            <Select
              value={ingrediente}
              onChange={(e) => setIngrediente(e.target.value)}
            >
              {ingredients.map((ing) => (
                <MenuItem key={ing.ingrediente_id} value={ing.ingrediente_id}>
                  {ing.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Cantidad"
            value={cantidad}
            onChange={handleCantidadChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Total del Pago"
            value={totalPago}
            onChange={handleTotalPagoChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Precio de Compra por Unidad"
            value={precioCompra}
            fullWidth
            margin="normal"
            type="number"
            disabled
          />
          <TextField
            label="Fecha de Compra"
            type="date"
            value={fechaCompra}
            onChange={(e) => setFechaCompra(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Medio de Pago"
            value={selectedMedioPago}
            onChange={(e) => setSelectedMedioPago(e.target.value)}
            style={{ marginBottom: "10px", marginTop: "10px" }}
            fullWidth
          >
            {mediosDePago.map(({ id, nombre }) => (
              <MenuItem key={id} value={id}>
                {nombre}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="primary">
            Registrar Compra
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default IngredientManagement;
