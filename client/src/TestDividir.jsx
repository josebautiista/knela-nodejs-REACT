import Test from "./Test";
Test;
const productos = [
  { id: 1, nombre: "Plato 1", precio: 10 },
  { id: 2, nombre: "Plato 2", precio: 15 },
  { id: 3, nombre: "Plato 3", precio: 12 },
];

function TestDividir() {
  return <div className="App">{/* <Test productos={productos} /> */}</div>;
}

export default TestDividir;
