import { useState, useEffect, useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ListadoPresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const { IP, tokenError } = useContext(Context);
  const navigate = useNavigate();

  const handleListarPresupuesto = () => {
    navigate("/presupuesto");
  };

  const formatearFechaYHora = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
    const opcionesHora = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Argentina/Buenos_Aires",
    };

    const fechaFormateada = fecha.toLocaleDateString("es-AR", opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString("es-AR", opcionesHora);

    return { fechaFormateada, horaFormateada };
  };

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const response = await fetch(`${IP}/api/presupuestos/v2/listar`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.AuthErr) {
          tokenError(data.MENSAJE);
        } else if (data.ServErr || data.ERROR) {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: data.MENSAJE,
            color: "#fff",
            background: "#333",
            confirmButtonColor: "#3085d6",
          });
        } else {
          setPresupuestos(
            data.presupuestos.map((p) => {
              const { fechaFormateada, horaFormateada } = formatearFechaYHora(
                p.fecha_presupuesto
              );
              return {
                ...p,
                fecha: fechaFormateada,
                hora: horaFormateada,
              };
            })
          );
          // console.log(data.presupuestos);
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error en la carga de datos",
          icon: "error",
          text: "Hubo un problema al conectar con el servidor.",
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
      }
    };
    fetchPresupuestos();
  }, [IP, tokenError]);

  const fetchImprimirPresupuesto = async (codigo) => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const response = await fetch(
        `${IP}/api/presupuestos/v2/listar/${codigo}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.AuthErr) {
        tokenError(data.MENSAJE);
        return [];
      } else if (data.ServErr || data.ERROR) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: data.MENSAJE,
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
        return [];
      } else {
        // console.log(data.productos);
        return data.productos;
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error en la carga de datos",
        icon: "error",
        text: "Hubo un problema al conectar con el servidor.",
        color: "#fff",
        background: "#333",
        confirmButtonColor: "#3085d6",
      });
      return [];
    }
  };

  const handleReimprimir = async (presupuesto) => {
    const doc = new jsPDF();
    const numeroPresupuesto = Math.floor(1000 + Math.random() * 9000);

    // Esperamos la respuesta del fetch y guardamos los productos
    const productos = await fetchImprimirPresupuesto(
      presupuesto.codigo_presupuesto
    );
    if (!productos || productos.length === 0) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No se encontraron productos para este presupuesto.",
        color: "#fff",
        background: "#333",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    doc.setFontSize(16);
    doc.text("Presupuesto de Productos", 14, 20);
    doc.setFontSize(12);
    doc.text(`Proveedor: ${presupuesto.razon_proveedor}`, 14, 30);
    doc.text(`Fecha: ${presupuesto.fecha}`, 14, 40);
    doc.text(`Hora: ${presupuesto.hora}`, 14, 50);
    doc.text(`Número de Presupuesto: ${numeroPresupuesto}`, 14, 60);

    autoTable(doc, {
      startY: 70,
      head: [["Código", "Fecha", "Hora"]],
      body: [
        [presupuesto.codigo_presupuesto, presupuesto.fecha, presupuesto.hora],
      ],
    });

    doc.setFontSize(16);
    doc.text("Productos", 14, 100);
    autoTable(doc, {
      startY: 105,
      head: [["Producto", "Marca", "Modelo", "Cantidad"]],
      body: productos.map((p) => [
        p.nombre,
        p.marca,
        p.modelo,
        p.cantidad_pedido,
      ]),
    });

    doc.save(`Presupuesto_${presupuesto.razon_proveedor}.pdf`);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#e6e2d5", borderRadius: 5 }}>
      <IconButton
        color="primary"
        onClick={handleListarPresupuesto}
        sx={{
          backgroundColor: "#ffeb3b",
          "&:hover": { backgroundColor: "#fdd835" },
          color: "#333",
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography
        variant="h4"
        sx={{
          margin: 4,
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
                <TableCell>{presupuesto.razon_proveedor}</TableCell>
                <TableCell>{presupuesto.codigo_presupuesto}</TableCell>
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
