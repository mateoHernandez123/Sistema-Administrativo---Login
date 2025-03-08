import { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const ListadoPresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        proveedor: "Proveedor A",
        codigo: "LAP123",
        nombre: "Laptop",
        marca: "Dell",
        modelo: "XPS 15",
        cantidad: 2,
      },
      {
        id: 2,
        proveedor: "Proveedor B",
        codigo: "MOU456",
        nombre: "Mouse",
        marca: "Logitech",
        modelo: "M705",
        cantidad: 5,
      },
      {
        id: 3,
        proveedor: "Proveedor A",
        codigo: "TEC789",
        nombre: "Teclado",
        marca: "Genius",
        modelo: "KB-110",
        cantidad: 3,
      },
    ];
    setPresupuestos(data);
  }, []);

  const handleReimprimir = (presupuesto) => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();
    const numeroPresupuesto = Math.floor(1000 + Math.random() * 9000);

    doc.setFontSize(16);
    doc.text("Presupuesto de Productos", 14, 20);
    doc.setFontSize(12);
    doc.text(`Proveedor: ${presupuesto.proveedor}`, 14, 30);
    doc.text(`Fecha: ${fecha}`, 14, 40);
    doc.text(`Número de Presupuesto: ${numeroPresupuesto}`, 14, 50);

    autoTable(doc, {
      startY: 60,
      head: [["Código", "Nombre", "Marca", "Modelo", "Cantidad"]],
      body: [
        [
          presupuesto.codigo,
          presupuesto.nombre,
          presupuesto.marca,
          presupuesto.modelo,
          presupuesto.cantidad,
        ],
      ],
    });

    doc.save(`Presupuesto_${presupuesto.proveedor}.pdf`);
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
        Listado de Presupuestos
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffeb3b" }}>
              <TableCell>
                <b>Proveedor</b>
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
              <TableCell>
                <b>Acción</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {presupuestos.map((presupuesto) => (
              <TableRow
                key={presupuesto.id}
                sx={{ backgroundColor: "#e0e0e0" }}
              >
                <TableCell>{presupuesto.proveedor}</TableCell>
                <TableCell>{presupuesto.codigo}</TableCell>
                <TableCell>{presupuesto.nombre}</TableCell>
                <TableCell>{presupuesto.marca}</TableCell>
                <TableCell>{presupuesto.modelo}</TableCell>
                <TableCell>{presupuesto.cantidad}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleReimprimir(presupuesto)}>
                    <PrintIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListadoPresupuestos;
