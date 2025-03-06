import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  TextField,
  Modal,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PresupuestoDetalle = () => {
  const location = useLocation();
  const presupuestos = location.state?.presupuestos || [];
  const [seleccionados, setSeleccionados] = useState({});
  const [cantidades, setCantidades] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const toggleSeleccion = (proveedor, producto) => {
    setSeleccionados((prev) => {
      const nuevos = { ...prev };
      if (!nuevos[proveedor]) nuevos[proveedor] = [];

      const index = nuevos[proveedor].findIndex((p) => p.id === producto.id);
      if (index !== -1) {
        nuevos[proveedor].splice(index, 1);
      } else {
        nuevos[proveedor].push({
          ...producto,
          cantidad: cantidades[producto.id] || producto.cantidad,
        });
      }
      return nuevos;
    });
  };

  const toggleSeleccionProveedor = (proveedor, productos) => {
    setSeleccionados((prev) => {
      const nuevos = { ...prev };
      nuevos[proveedor] =
        nuevos[proveedor]?.length === productos.length
          ? []
          : productos.map((p) => ({
              ...p,
              cantidad: cantidades[p.id] || p.cantidad,
            }));
      return nuevos;
    });
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    setCantidades((prev) => ({ ...prev, [productoId]: nuevaCantidad }));
    setSeleccionados((prev) => {
      const nuevos = { ...prev };
      Object.keys(nuevos).forEach((proveedor) => {
        nuevos[proveedor] = nuevos[proveedor].map((p) =>
          p.id === productoId ? { ...p, cantidad: nuevaCantidad } : p
        );
      });
      return nuevos;
    });
  };

  const generarPDFs = () => {
    Object.entries(seleccionados).forEach(([proveedor, productos]) => {
      if (!productos.length) return;

      const doc = new jsPDF();
      const fecha = new Date().toLocaleDateString();
      const numeroPresupuesto = Math.floor(1000 + Math.random() * 9000);

      doc.setFontSize(16);
      doc.text("Presupuesto de Productos", 14, 20);
      doc.setFontSize(12);
      doc.text(`Proveedor: ${proveedor}`, 14, 30);
      doc.text(`Fecha: ${fecha}`, 14, 40);
      doc.text(`Número de Presupuesto: ${numeroPresupuesto}`, 14, 50);

      autoTable(doc, {
        startY: 60,
        head: [["Código", "Nombre", "Marca", "Modelo", "Cantidad"]],
        body: productos.map((p) => [
          p.codigo,
          p.nombre,
          p.marca,
          p.modelo,
          p.cantidad,
        ]),
      });

      doc.save(`Presupuesto_${proveedor}.pdf`);
    });
    setModalOpen(false);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#e6e2d5", borderRadius: 5 }}>
      <Typography
        variant="h4"
        sx={{
          marginBottom: 4,
          color: "#333",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Detalles de Presupuesto
      </Typography>
      {presupuestos.map(([proveedor, productos]) => {
        const todosSeleccionados =
          seleccionados[proveedor]?.length === productos.length;
        return (
          <TableContainer
            component={Paper}
            key={proveedor}
            sx={{ marginBottom: 3, borderRadius: 5 }}
          >
            <Typography
              variant="h6"
              sx={{
                backgroundColor: "#ffeb3b",
                padding: 2,
                borderRadius: "5px 5px 0 0",
                fontWeight: "bold",
              }}
            >
              {proveedor}
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#ffeb3b" }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={todosSeleccionados || false}
                      onChange={() =>
                        toggleSeleccionProveedor(proveedor, productos)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <b>Código</b>
                  </TableCell>
                  <TableCell>
                    <b>Nombre</b>
                  </TableCell>
                  <TableCell>
                    <b>Marca</b>
                  </TableCell>
                  <TableCell>
                    <b>Modelo</b>
                  </TableCell>
                  <TableCell>
                    <b>Cantidad</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow
                    key={producto.id}
                    sx={{ backgroundColor: "#e0e0e0" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          seleccionados[proveedor]?.some(
                            (p) => p.id === producto.id
                          ) || false
                        }
                        onChange={() => toggleSeleccion(proveedor, producto)}
                      />
                    </TableCell>
                    <TableCell>{producto.codigo}</TableCell>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.marca}</TableCell>
                    <TableCell>{producto.modelo}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={cantidades[producto.id] || producto.cantidad}
                        onChange={(e) =>
                          actualizarCantidad(producto.id, e.target.value)
                        }
                        inputProps={{ min: 1 }}
                        size="small"
                        sx={{ width: "80px" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      })}

      <Button
        variant="contained"
        sx={{ marginTop: 3, backgroundColor: "#ffeb3b", color: "black" }}
        onClick={() => setModalOpen(true)}
        disabled={Object.keys(seleccionados).every(
          (p) => seleccionados[p].length === 0
        )}
      >
        Confirmar
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: "white",
            margin: "auto",
            marginTop: 10,
            width: "50%",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Confirmar Presupuesto</Typography>
          {Object.entries(seleccionados).map(([proveedor, productos]) => (
            <Box key={proveedor} sx={{ marginTop: 2 }}>
              <Typography variant="h6">{proveedor}</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.codigo}</TableCell>
                      <TableCell>{p.nombre}</TableCell>
                      <TableCell>{p.cantidad}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Button variant="contained" onClick={generarPDFs}>
              Generar PDF
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PresupuestoDetalle;
