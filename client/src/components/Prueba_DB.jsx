import axios from "axios";
import { useState } from "react";

export default function Prueba_DB() {
  const [id_compra, setId_compra] = useState("");
  const [id_venta, setId_venta] = useState("");
  const [cantidad_compra, setCantidad_compra] = useState(0);
  const [cantidad_venta, setCantidad_venta] = useState(0);

  const handleCompra = (e) => {
    e.preventDefault();
    console.log("la compra es: ", id_compra, cantidad_compra);
    axios
      .post("http://localhost:3000/compra", {
        id: id_compra,
        cantidad: cantidad_compra,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleVenta = (e) => {
    e.preventDefault();
    console.log("la venta es: ", id_venta, cantidad_venta);

    axios
      .post("http://localhost:3000/venta", {
        id: id_venta,
        cantidad: cantidad_venta,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleId_compra = (e) => {
    setId_compra(e.target.value);
  };

  const handleId_venta = (e) => {
    setId_venta(e.target.value);
  };

  const handleCantidad_compra = (e) => {
    setCantidad_compra(e.target.value);
  };

  const handleCantidad_venta = (e) => {
    setCantidad_venta(e.target.value);
  };

  return (
    <>
      <form>
        <h1>Compra</h1>
        <label>
          ID:
          <input type="text" onChange={handleId_compra} value={id_compra} />
        </label>

        <label>
          Producto:
          <input type="text" />
        </label>

        <label>
          cantidad:
          <input
            type="number"
            onChange={handleCantidad_compra}
            value={cantidad_compra}
          />
        </label>

        <button type="button" onClick={handleCompra}>
          Comprar
        </button>
      </form>

      <form>
        <h1>Venta</h1>
        <label>
          ID:
          <input type="text" onChange={handleId_venta} value={id_venta} />
        </label>

        <label>
          Producto:
          <input type="text" />
        </label>

        <label>
          cantidad:
          <input
            type="number"
            onChange={handleCantidad_venta}
            value={cantidad_venta}
          />
        </label>

        <button type="button" onClick={handleVenta}>
          Vender
        </button>
      </form>
    </>
  );
}
