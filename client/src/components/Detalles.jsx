import {
  Button,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const DivContenedor = styled.div`
  display: flex;
  gap: 10px;
  height: 80vh;
`;

const DivIzquierdo = styled.div`
  width: 40%;
  height: 100%;
  background-color: transparent;
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  user-select: none;
`;

const ContainerDetallesProductos = styled.div`
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const NombreColumnas = styled(Paper)`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
  font-weight: bold;
  gap: 10px;
  border: 1px solid #242424;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid #242424;
`;

const ProductoCarrito = styled(Paper)`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
  gap: 10px;
`;

const DivCantidad = styled.div`
  flex-basis: 20%;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const InputCantidad = styled.input`
  width: 40px;
  text-align: center;
  background: white;
  outline: none;
  color: black;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const DivCentro = styled.div`
  width: 20%;
  height: 100%;
  background: #242424;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 5px;
  user-select: none;
`;

const Categorias = styled(Paper)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-grow: 1;
  font-weight: bold;
`;

const DivDerecho = styled.div`
  width: 40%;
  height: 100%;
  background: #242424;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 5px;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  user-select: none;
`;

const ProductosAdd = styled(Paper)`
  width: 130px;
  height: 130px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

export const Detalles = ({ idMesa }) => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [nuevo, setNuevo] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTable, setNewTable] = useState("");
  const [tableOptions, setTableOptions] = useState([]);
  const [selectedTable, setSelectedTable] = useState(idMesa);

  const total = nuevo
    .map(
      (producto) =>
        (producto.precio_venta !== undefined
          ? producto.precio_venta
          : producto.precio_unitario) * producto.cantidad
    )
    .reduce((total, valor) => total + valor, 0);

  useEffect(() => {
    // Fetch table options from the API
    axios
      .get("http://localhost:3000/mesas")
      .then((response) => {
        setTableOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching table options:", error);
      });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    if (newTable) {
      axios
        .put(
          `http://localhost:3000/carrito_compras/cambiar_mesa/${selectedTable}/${newTable}`
        )
        .then((response) => {
          console.log("Products transferred successfully:", response.data);
          setSelectedTable(newTable); // Actualizar la mesa seleccionada
          handleClose();
        })
        .catch((error) => {
          console.error("Error transferring products:", error);
        });
    }
  };

  //traer todas las categorias de la API
  useEffect(() => {
    axios
      .get("http://localhost:3000/categorias")
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  //manejador que actualiza la categoria que selecciono el usuario
  const handleClick = (id) => {
    setCategoriaSeleccionada(id);
  };

  useEffect(() => {
    if (categoriaSeleccionada) {
      axios
        .get(
          `http://localhost:3000/productos/categoria?id=${categoriaSeleccionada}`
        )
        .then((response) => {
          const productos = response.data.map((producto) => ({
            ...producto,
            precio_venta: producto.precio_unitario,
          }));

          setProductos(productos);
        })
        .catch((error) => {
          console.error("Error al obtener datos de la API:", error);
        });
    }
  }, [categoriaSeleccionada]);

  const obtenerProductosEnCarrito = useCallback(() => {
    axios
      .get(`http://localhost:3000/carrito_compras/${selectedTable}`)
      .then((response) => {
        const productos = response.data.filter(
          (producto) => producto.cantidad > 0
        );
        setNuevo(productos);
      })
      .catch((error) => {
        console.error("Error al obtener productos en carrito:", error);
      });
  }, [selectedTable]);

  useEffect(() => {
    obtenerProductosEnCarrito();
  }, [obtenerProductosEnCarrito]);

  const agregarProducto = (producto) => {
    // Realizar una solicitud GET a la API para obtener el producto en el carrito actual de la mesa
    axios
      .get(
        `http://localhost:3000/carrito_compras/existe/${selectedTable}/${producto.producto_id}`
      )
      .then((response) => {
        const productoEnCarrito = response.data;

        if (productoEnCarrito) {
          console.log("existe");
          // Si el producto ya existe en el carrito, aumentar la cantidad en la API
          const nuevaCantidad = productoEnCarrito.cantidad + 1;
          console.log(nuevaCantidad);
          axios
            .put(
              `http://localhost:3000/carrito_compras/${selectedTable}/${producto.producto_id}/actualizar_cantidad`,
              {
                ...productoEnCarrito,
                cantidad: nuevaCantidad,
              }
            )
            .then(() => {
              // Actualizar el estado local con los datos actualizados de la API
              setNuevo((prevNuevo) =>
                prevNuevo.map((producto) =>
                  producto.producto_id === productoEnCarrito.producto_id
                    ? { ...producto, cantidad: nuevaCantidad }
                    : producto
                )
              );
              console.log("Cantidad de producto aumentada en el carrito.");
            })
            .catch((error) => {
              console.error(
                "Error al aumentar la cantidad del producto en el carrito:",
                error
              );
            });
        } else {
          // Si el producto no existe en el carrito, agregarlo al carrito en la API
          axios
            .post("http://localhost:3000/carrito_compras", {
              ...producto,
              mesa_id: selectedTable,
              cantidad: 1,
            })
            .then(() => {
              // Actualizar el estado local con los datos actualizados de la API
              setNuevo((prevNuevo) => [
                ...prevNuevo,
                { ...producto, cantidad: 1 },
              ]);
              console.log("Producto agregado al carrito.");
            })
            .catch((error) => {
              console.error("Error al agregar el producto al carrito:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error al obtener el producto en el carrito:", error);
      });
  };

  const eliminarProductoCarrito = (productoId) => {
    axios
      .delete(
        `http://localhost:3000/carrito_compras/existe/${selectedTable}/${productoId}`
      )
      .then(() => {
        // Actualizar el estado local eliminando el producto con productoId
        setNuevo((prevNuevo) =>
          prevNuevo.filter((producto) => producto.producto_id !== productoId)
        );
        console.log("Producto eliminado del carrito en el backend.");
      })
      .catch((error) => {
        console.error("Error al eliminar el producto del carrito:", error);
      });
  };

  // Función para restar cantidad o eliminar el producto del carrito
  const restarCantidad = (producto) => {
    const nuevaCantidad = producto.cantidad - 1;
    if (nuevaCantidad <= 0) {
      // Si la cantidad llega a 0, eliminar el producto del carrito en el backend
      eliminarProductoCarrito(producto.producto_id);
    } else {
      // Si la cantidad es mayor a 0, actualizar la cantidad en el carrito mediante una solicitud PUT a la API
      axios
        .put(
          `http://localhost:3000/carrito_compras/${selectedTable}/${producto.producto_id}/actualizar_cantidad`,
          {
            cantidad: nuevaCantidad,
          }
        )
        .then(() => {
          // Actualizar el estado local con los datos actualizados de la API
          setNuevo((prevNuevo) =>
            prevNuevo.map((pro) =>
              pro.producto_id === producto.producto_id
                ? { ...pro, cantidad: nuevaCantidad }
                : pro
            )
          );
          console.log("Cantidad de producto restada en el carrito.");
        })
        .catch((error) => {
          console.error(
            "Error al restar la cantidad del producto en el carrito:",
            error
          );
        });
    }
  };

  const modificarCantidad = (producto, cantidad) => {
    const nuevaCantidad = cantidad;
    if (nuevaCantidad !== null) {
      axios
        .put(
          `http://localhost:3000/carrito_compras/${selectedTable}/${producto.producto_id}/actualizar_cantidad`,
          {
            cantidad: nuevaCantidad,
          }
        )
        .then(() => {
          // Actualizar el estado local con los datos actualizados de la API
          setNuevo((prevNuevo) =>
            prevNuevo.map((pro) =>
              pro.producto_id === producto.producto_id
                ? { ...pro, cantidad: nuevaCantidad }
                : pro
            )
          );
          console.log("Cantidad de producto restada en el carrito.");
        })
        .catch((error) => {
          console.error(
            "Error al restar la cantidad del producto en el carrito:",
            error
          );
        });
    }
  };

  const modificarPrecio = (producto, precio) => {
    const nuevoPrecio = precio;
    if (nuevoPrecio !== null) {
      axios
        .put(
          `http://localhost:3000/carrito_compras/${selectedTable}/${producto.producto_id}/actualizar_precio`,
          {
            precio_venta: precio,
          }
        )
        .then(() => {
          // Actualizar el estado local con los datos actualizados de la API
          setNuevo((prevNuevo) =>
            prevNuevo.map((pro) =>
              pro.producto_id === producto.producto_id
                ? { ...pro, precio_venta: precio }
                : pro
            )
          );
          console.log("Cantidad de producto restada en el carrito.");
        })
        .catch((error) => {
          console.error(
            "Error al restar la cantidad del producto en el carrito:",
            error
          );
        });
    }
  };
  //registra la venta en la API
  const registrarVenta = () => {
    const nuevaVenta = {
      cliente_id: 1,
      detalles: nuevo.map((producto) => ({
        producto_id: producto.producto_id,
        nombre_producto: producto.nombre,
        cantidad: producto.cantidad,
        precio_venta: producto.precio_venta,
        valor_total: producto.precio_venta * producto.cantidad,
        medio_pago_id: selectedMedioPago,
        cantidad_pago: parseFloat(montoPagado.replace(/\./g, "")), // Cambia a cantidad_pagado en lugar de montoPagado
      })),
      mesa_id: selectedTable,
    };

    axios
      .post("http://localhost:3000/ventas", nuevaVenta)
      .then(() => {
        axios
          .delete(`http://localhost:3000/carrito_compras/${selectedTable}`)
          .then(() => {
            console.log("Carrito vaciado correctamente en el backend.");
            setNuevo([]); // Vaciar el estado local de productos en el carrito
          })
          .catch((error) => {
            console.error("Error al vaciar el carrito:", error);
          });
      })
      .catch((error) => {
        console.error("Error al crear la nueva venta:", error);
      });
  };

  //funcion para poner estetico los precios
  const formatNumber = (number) => {
    const optionsCOP = {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    };
    return number.toLocaleString("es-CO", optionsCOP);
  };

  const [selectedMedioPago, setSelectedMedioPago] = useState("");
  const [mediosDePago, setMediosDePago] = useState([]);
  const [montoPagado, setMontoPagado] = useState("");
  const [medioPagoValido, setMedioPagoValido] = useState(false);

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

  const handleMedioPagoChange = (event) => {
    setSelectedMedioPago(event.target.value);
    setMedioPagoValido(event.target.value !== ""); // Actualiza la validez del medio de pago
  };

  const handleMontoPagadoChange = (event) => {
    const value = event.target.value;
    const formattedValue = value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setMontoPagado(formattedValue);
  };
  const diferencia =
    montoPagado !== "" ? parseFloat(montoPagado.replace(/\./g, "")) - total : 0;
  return (
    <>
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
                {tableOptions.map((table) => (
                  <MenuItem key={table.mesa_id} value={table.mesa_id}>
                    Mesa {table.mesa_id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirm} color="primary">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <DivContenedor>
        <DivIzquierdo>
          <ContainerDetallesProductos className="add-producto">
            <NombreColumnas>
              <div style={{ flexBasis: "50%" }}>Producto</div>
              <div style={{ flexBasis: "20%" }}>Cantidad</div>
              <div style={{ flexBasis: "20%" }}>Unidad</div>
              <div style={{ flexBasis: "10%" }}>Valor</div>
            </NombreColumnas>
            {nuevo.map((producto, i) => (
              <ProductoCarrito key={i}>
                <div style={{ flexBasis: "40%" }}>{producto.nombre}</div>
                <DivCantidad>
                  <RemoveIcon
                    color="error"
                    sx={{ cursor: "pointer" }}
                    onClick={() => restarCantidad(producto)}
                  />
                  <InputCantidad
                    type="tel"
                    value={producto.cantidad === 0 ? "" : producto.cantidad}
                    onChange={(e) => {
                      const nuevaCantidad = parseInt(e.target.value, 10) || 0;
                      setNuevo((prevAddProducto) =>
                        prevAddProducto.map((pro) =>
                          pro.producto_id === producto.producto_id
                            ? { ...pro, cantidad: nuevaCantidad }
                            : pro
                        )
                      );
                      modificarCantidad(producto, nuevaCantidad);
                    }}
                  />
                  <AddIcon
                    color="success"
                    sx={{ cursor: "pointer" }}
                    onClick={() => agregarProducto(producto)}
                  />
                </DivCantidad>

                <InputCantidad
                  type="tel"
                  value={
                    producto.precio_venta !== undefined
                      ? producto.precio_venta
                      : ""
                  }
                  onChange={(e) => {
                    const nuevoPrecio = parseInt(e.target.value);
                    setNuevo((prevAddProducto) =>
                      prevAddProducto.map((prod) =>
                        prod.producto_id === producto.producto_id
                          ? {
                              ...prod,
                              precio_venta: isNaN(nuevoPrecio)
                                ? undefined
                                : nuevoPrecio,
                            }
                          : prod
                      )
                    );
                    modificarPrecio(producto, nuevoPrecio); // Enviar el producto con el precio cambiado como parámetro
                  }}
                />

                <p style={{ flexBasis: "10%" }}>
                  {formatNumber(producto.precio_venta * producto.cantidad || 0)}
                </p>
              </ProductoCarrito>
            ))}
          </ContainerDetallesProductos>

          <Paper
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "60%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                fontSize: "1.5rem",
              }}
            >
              <div
                style={{
                  marginBottom: "10px",
                  fontWeight: "bold",
                  fontSize: "1.7rem",
                }}
              >
                Total a Pagar
              </div>
              <div
                style={{
                  fontSize: "2.5rem",
                  color: "green",
                }}
              >
                {formatNumber(total)}
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "1.7rem",
                }}
              >
                Cambio: {diferencia > 0 ? formatNumber(diferencia) : 0}
              </div>
            </div>

            <div
              style={{ width: "40%", display: "flex", flexDirection: "column" }}
            >
              <TextField
                select
                label="Medio de Pago"
                value={selectedMedioPago}
                onChange={handleMedioPagoChange}
                style={{ marginBottom: "10px" }}
              >
                {mediosDePago.map((medio) => (
                  <MenuItem key={medio.id} value={medio.id}>
                    {medio.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Monto Pagado"
                value={montoPagado}
                onChange={handleMontoPagadoChange}
                type="text"
                style={{ marginBottom: "10px" }}
              />
              <Button
                color="success"
                size="large"
                variant="contained"
                onClick={registrarVenta}
                disabled={!medioPagoValido} // Deshabilita el botón si el medio de pago no es válido
              >
                Cobrar
              </Button>
            </div>
          </Paper>
        </DivIzquierdo>

        <DivCentro>
          {categorias.map((cat, i) => (
            <Categorias key={i} onClick={() => handleClick(cat.categoria_id)}>
              {cat.nombre}
            </Categorias>
          ))}
        </DivCentro>

        <DivDerecho className="productos">
          {productos.map((producto, i) => (
            <ProductosAdd key={i} onClick={() => agregarProducto(producto)}>
              <p style={{ textAlign: "center", fontWeight: "bold" }}>
                {producto.nombre}
              </p>
              <span>{formatNumber(producto.precio_unitario)}</span>
            </ProductosAdd>
          ))}
        </DivDerecho>
      </DivContenedor>
    </>
  );
};

Detalles.propTypes = {
  idMesa: PropTypes.number.isRequired,
};

export default Detalles;
