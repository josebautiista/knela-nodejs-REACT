import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mesas from "./components/Mesas";
import Menu from "./components/Menu";
import Ventas from "./components/ventas/Ventas";
import Inventario from "./components/Inventario";
import Compras from "./components/compras/Compras";
import TestDividir from "./TestDividir";

function App() {
  return (
    <>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Mesas />} />
          <Route path="/Mesas" element={<Mesas />} />
          <Route path="/Ventas" element={<Ventas />} />
          <Route path="/Inventario" element={<Inventario />} />
          <Route path="/Compras" element={<Compras />} />
          <Route path="/Test" element={<TestDividir />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
