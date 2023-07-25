import { Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const Detalles = ({
  addProducto,
  setAddProducto,
  eliminarProductosDeMesa,
}) => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

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

  const handleClick = (id) => {
    setCategoriaSeleccionada(id);
  };

  useEffect(() => {
    if (categoriaSeleccionada) {
      axios
        .get(`http://localhost:3000/productos?id=${categoriaSeleccionada}`)
        .then((response) => {
          setProductos(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener datos de la API:", error);
        });
    }
  }, [categoriaSeleccionada]);

  const agregarProducto = (producto) => {
    const existe = addProducto.find(
      (pro) => pro.producto_id === producto.producto_id
    );

    if (existe) {
      setAddProducto((prevAddProducto) =>
        prevAddProducto.map((pro) =>
          pro.producto_id === producto.producto_id
            ? { ...pro, cantidad: pro.cantidad + 1 }
            : pro
        )
      );
    } else {
      producto.cantidad = 1;
      setAddProducto((prevAddProducto) => [...prevAddProducto, producto]);
    }
  };

  const restarCantidad = (producto) => {
    // Verificar si el producto existe en addProducto
    const existe = addProducto.find(
      (pro) => pro.producto_id === producto.producto_id
    );

    if (existe) {
      // Actualizar la cantidad del producto
      const updatedAddProducto = addProducto.map((pro) =>
        pro.producto_id === producto.producto_id
          ? { ...pro, cantidad: pro.cantidad - 1 }
          : pro
      );

      // Filtrar los productos con cantidad mayor que 0 y actualizar el estado
      setAddProducto(updatedAddProducto.filter((pro) => pro.cantidad > 0));
    }
  };

  const registrarVenta = () => {
    const nuevaVenta = {
      cliente_id: 1,
      detalles: addProducto.map((producto) => ({
        producto_id: producto.producto_id,
        nombre_producto: producto.nombre,
        cantidad: producto.cantidad,
        precio: producto.precio_unitario * producto.cantidad,
        valor_total: producto.precio_unitario * producto.cantidad,
      })),
    };

    axios
      .post("http://localhost:3000/ventas", nuevaVenta)
      .then(() => {
        eliminarProductosDeMesa();
        setAddProducto([]);
      })
      .catch((error) => {
        console.error("Error al crear la nueva venta:", error);
      });
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  return (
    <div style={{ display: "flex", gap: "10px", height: "80vh" }}>
      <div
        style={{
          width: "40%",
          height: "100%",
          background: "skyblue",
          borderRadius: "5px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "10px",
          padding: "10px",
        }}
      >
        <div
          style={{
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
          className="add-producto"
        >
          <Paper
            style={{
              width: "100%",
              height: "50px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box",
              padding: "10px",
              fontWeight: "bold",
              gap: "10px",
            }}
          >
            <div style={{ flexBasis: "40%" }}>Producto</div>
            <div style={{ flexBasis: "20%" }}>Cantidad</div>
            <div style={{ flexBasis: "20%" }}>Valor</div>
          </Paper>
          {addProducto.map((producto, i) => (
            <Paper
              key={i}
              style={{
                width: "100%",
                height: "50px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxSizing: "border-box",
                padding: "10px",
                gap: "10px",
              }}
            >
              <div style={{ width: "60%" }}>{producto.nombre}</div>
              <div
                style={{
                  width: "35%",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <RemoveIcon
                  color="error"
                  sx={{ cursor: "pointer" }}
                  onClick={() => restarCantidad(producto)}
                />
                <input
                  type="tel"
                  value={producto.cantidad === 0 ? "" : producto.cantidad}
                  onChange={(e) => {
                    const nuevaCantidad = parseInt(e.target.value, 10) || 0;
                    setAddProducto((prevAddProducto) =>
                      prevAddProducto.map((pro) =>
                        pro.producto_id === producto.producto_id
                          ? { ...pro, cantidad: nuevaCantidad }
                          : pro
                      )
                    );
                  }}
                  style={{
                    width: "50px",
                    textAlign: "center",
                    background: "white",
                    outline: "none",
                    color: "black",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
                <AddIcon
                  color="success"
                  sx={{ cursor: "pointer" }}
                  onClick={() => agregarProducto(producto)}
                />
              </div>
              <div style={{ width: "25%" }}>
                $ {formatNumber(producto.precio_unitario * producto.cantidad)}
              </div>
              <div style={{}}></div>
            </Paper>
          ))}
        </div>
        <div>
          <Paper
            style={{
              width: "100%",
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              flexDirection: "column",
              boxSizing: "border-box",
              padding: "30px",
              fontSize: "2rem",
            }}
          >
            <div>
              Total: ${" "}
              {formatNumber(
                addProducto
                  .map(
                    (producto) => producto.precio_unitario * producto.cantidad
                  )
                  .reduce((total, valor) => total + valor, 0)
              )}
            </div>
            <Button
              size="large"
              color="success"
              sx={{ border: "1px solid green" }}
              onClick={registrarVenta}
            >
              Cobrar
            </Button>
          </Paper>
        </div>
      </div>

      <div
        style={{
          width: "20%",
          height: "100%",
          background: "skyblue",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          boxSizing: "border-box",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {categorias.map((cat, i) => (
          <Paper
            key={i}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              flexGrow: 1,
            }}
            onClick={() => handleClick(cat.categoria_id)}
          >
            {cat.nombre}
          </Paper>
        ))}
      </div>
      <div
        style={{
          width: "40%",
          height: "100%",
          background: "skyblue",
          boxSizing: "border-box",
          padding: "10px",
          borderRadius: "5px",
          overflowY: "scroll",
        }}
        className="productos"
      >
        {productos.map((producto, i) => (
          <Paper
            key={i}
            style={{
              width: "130px",
              height: "130px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => agregarProducto(producto)}
          >
            {producto.nombre}
          </Paper>
        ))}
      </div>
    </div>
  );
};

Detalles.propTypes = {
  idMesa: PropTypes.number.isRequired,
  addProducto: PropTypes.array.isRequired,
  setAddProducto: PropTypes.func.isRequired,
  eliminarProductosDeMesa: PropTypes.func.isRequired,
};

export default Detalles;
