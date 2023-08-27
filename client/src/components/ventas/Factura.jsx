import { useRef } from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

export default function Factura({
  formatDateTime,
  selectedVenta,
  setOpenModal,
  openModal,
  detalleVentas,
  formatNumber,
}) {
  const contentRef = useRef(null);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePrint = () => {
    const printableContent = contentRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
      <head>
        <title>Detalles de la Venta</title>
        <style>
          /* Estilos opcionales para la impresión */
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 10px;
          }
        </style>
      </head>
      <body>
        ${printableContent}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={openModal} onClose={handleCloseModal}>
      <DialogTitle>Detalles de la Venta</DialogTitle>
      <DialogContent className="detalles_venta" ref={contentRef}>
        {/* Aquí puedes mostrar los detalles de la venta seleccionada */}
        {selectedVenta && (
          <div>
            <p>
              <b>ID Venta:</b> {selectedVenta.venta_id}
            </p>

            <h3>Cliente:</h3>
            <p>
              <b>ID:</b> {selectedVenta.cliente_id}
            </p>
            <p>
              <b>Nombre:</b> {selectedVenta.nombre_cliente}
            </p>
            <p>
              <b>Email:</b> {selectedVenta.email_cliente}
            </p>
            <p>
              <b>Telefono:</b> {selectedVenta.telefono_cliente}
            </p>
            <br></br>
            <p>
              <b>Fecha y Hora:</b> {formatDateTime(selectedVenta.fecha_hora)}
            </p>
            <p>
              <b>Metodo de pago:</b> {selectedVenta.nombre_medio_pago}
            </p>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }}>
                      <b>Producto</b>
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <b>Cantidad</b>
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <b>Precio</b>
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <b>Total</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {detalleVentas.map((detalle, index) => (
                    <TableRow key={index}>
                      <TableCell>{detalle.nombre_producto}</TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {detalle.cantidad}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {formatNumber(detalle.precio_venta)}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {formatNumber(detalle.valor_total)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total, Recibido y Cambio al final de la tabla */}
                  <TableRow></TableRow>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <b style={{ fontSize: "1.8em", fontWeight: "bold" }}>
                        Total:
                      </b>
                    </TableCell>
                    <TableCell>
                      <span style={{ fontSize: "1.8em", fontWeight: "bold" }}>
                        {formatNumber(selectedVenta.total)}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <b>Recibido:</b>
                    </TableCell>
                    <TableCell>
                      {formatNumber(selectedVenta.cantidad_pago)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <b>Cambio:</b>
                    </TableCell>
                    <TableCell>
                      {formatNumber(
                        selectedVenta.cantidad_pago - selectedVenta.total < 0
                          ? 0
                          : selectedVenta.cantidad_pago - selectedVenta.total
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePrint} color="primary" variant="contained">
          Imprimir
        </Button>
        <Button onClick={handleCloseModal} color="error" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Factura.propTypes = {
  formatDateTime: PropTypes.func.isRequired,
  selectedVenta: PropTypes.object,
  setOpenModal: PropTypes.func.isRequired,
  openModal: PropTypes.bool.isRequired,
  detalleVentas: PropTypes.array.isRequired,
  formatNumber: PropTypes.func.isRequired,
};
