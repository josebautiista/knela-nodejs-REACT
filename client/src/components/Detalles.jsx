import { Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { useEffect, useState } from "react";
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
  width: 35%;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const InputCantidad = styled.input`
  width: 50px;
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
`;

const ProductosAdd = styled(Paper)`
  width: 130px;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
`;

export const Detalles = ({
  idMesa,
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
    const existe = addProducto.find(
      (pro) => pro.producto_id === producto.producto_id
    );

    if (existe) {
      const updatedAddProducto = addProducto.map((pro) =>
        pro.producto_id === producto.producto_id
          ? { ...pro, cantidad: pro.cantidad - 1 }
          : pro
      );
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
      mesa_id: idMesa,
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
    <DivContenedor>
      <DivIzquierdo>
        <ContainerDetallesProductos className="add-producto">
          <NombreColumnas>
            <div style={{ flexBasis: "40%" }}>Producto</div>
            <div style={{ flexBasis: "20%" }}>Cantidad</div>
            <div style={{ flexBasis: "20%" }}>Valor</div>
          </NombreColumnas>
          {addProducto.map((producto, i) => (
            <ProductoCarrito key={i}>
              <div style={{ width: "60%" }}>{producto.nombre}</div>
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
                    setAddProducto((prevAddProducto) =>
                      prevAddProducto.map((pro) =>
                        pro.producto_id === producto.producto_id
                          ? { ...pro, cantidad: nuevaCantidad }
                          : pro
                      )
                    );
                  }}
                />
                <AddIcon
                  color="success"
                  sx={{ cursor: "pointer" }}
                  onClick={() => agregarProducto(producto)}
                />
              </DivCantidad>
              <div style={{ width: "25%" }}>
                $ {formatNumber(producto.precio_unitario * producto.cantidad)}
              </div>
            </ProductoCarrito>
          ))}
        </ContainerDetallesProductos>
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
            {producto.nombre}
          </ProductosAdd>
        ))}
      </DivDerecho>
    </DivContenedor>
  );
};

Detalles.propTypes = {
  idMesa: PropTypes.number.isRequired,
  addProducto: PropTypes.array.isRequired,
  setAddProducto: PropTypes.func.isRequired,
  eliminarProductosDeMesa: PropTypes.func.isRequired,
};

export default Detalles;
