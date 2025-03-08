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
        fecha: "08/03/2025",
        hora: "20:45",
      },
      {
        id: 2,
        proveedor: "Proveedor B",
        codigo: "MOU456",
        fecha: "07/03/2025",
        hora: "15:04",
      },
      {
        id: 3,
        proveedor: "Proveedor A",
        codigo: "TEC789",
        fecha: "06/03/2025",
        hora: "10:00",
      },
    ];
    setPresupuestos(data);
  }, []);

  const handleReimprimir = (presupuesto) => {
    const doc = new jsPDF();
    const numeroPresupuesto = Math.floor(1000 + Math.random() * 9000);

    doc.setFontSize(16);
    doc.text("Presupuesto de Productos", 14, 20);
    doc.setFontSize(12);
    doc.text(`Proveedor: ${presupuesto.proveedor}`, 14, 30);
    doc.text(`Fecha: ${presupuesto.fecha}`, 14, 40);
    doc.text(`Hora: ${presupuesto.hora}`, 14, 50);
    doc.text(`Número de Presupuesto: ${numeroPresupuesto}`, 14, 60);

    autoTable(doc, {
      startY: 70,
      head: [["Código", "Fecha", "Hora"]],
      body: [[presupuesto.codigo, presupuesto.fecha, presupuesto.hora]],
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
                <b>Fecha</b>
              </TableCell>
              <TableCell>
                <b>Hora</b>
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
                <TableCell>{presupuesto.fecha}</TableCell>
                <TableCell>{presupuesto.hora}</TableCell>
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
