import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const GeneradorPresupuestos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [seleccionarTodos, setSeleccionarTodos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulación de datos obtenidos de una API
    const data = {
      pedidos: [
        {
          id: "p1",
          codigo: "LAP123",
          nombre: "Laptop",
          marca: "Dell",
          modelo: "XPS 15",
          descripcion: "Core i7, 16GB RAM, SSD 1TB",
          cantidad: 2,
          proveedores: ["Proveedor A", "Proveedor B"],
        },
        {
          id: "p2",
          codigo: "MOU456",
          nombre: "Mouse",
          marca: "Logitech",
          modelo: "M705",
          descripcion: "Inalámbrico, ergonómico",
          cantidad: 5,
          proveedores: ["Proveedor A"],
        },
        {
          id: "p3",
          codigo: "TEC789",
          nombre: "Teclado",
          marca: "Genius",
          modelo: "KB-110",
          descripcion: "Inalámbrico, silencioso",
          cantidad: 3,
          proveedores: ["Proveedor B"],
        },
      ],
    };

    setPedidos(data.pedidos);
  }, []);

  const handleListar = () => {
    navigate("/listar-presupuesto");
  };

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSeleccionarTodos = () => {
    if (seleccionarTodos) {
      setSeleccionados([]);
    } else {
      setSeleccionados(pedidos.map((p) => p.id));
    }
    setSeleccionarTodos(!seleccionarTodos);
  };

  const generarPresupuestos = () => {
    const pedidosSeleccionados = pedidos.filter((p) =>
      seleccionados.includes(p.id)
    );

    const agrupadosPorProveedor = {};
    pedidosSeleccionados.forEach((pedido) => {
      pedido.proveedores.forEach((proveedor) => {
        if (!agrupadosPorProveedor[proveedor]) {
          agrupadosPorProveedor[proveedor] = [];
        }
        agrupadosPorProveedor[proveedor].push({
          id: pedido.id,
          codigo: pedido.codigo,
          nombre: pedido.nombre,
          marca: pedido.marca,
          modelo: pedido.modelo,
          cantidad: pedido.cantidad,
        });
      });
    });

    navigate("/presupuestos", {
      state: { presupuestos: Object.entries(agrupadosPorProveedor) },
    });
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
        Listado de Pedidos
      </Typography>
      <Box display="flex" justifyContent="right" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            onClick={handleListar}
            sx={{
              backgroundColor: "#ffeb3b",
              color: "black",
              marginRight: 5,
              borderRadius: "1.2rem",
            }}
          >
            Listado de Presupuestos
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffeb3b" }}>
              <TableCell>
                <Checkbox
                  checked={seleccionarTodos}
                  onChange={toggleSeleccionarTodos}
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
                <b>Descripción</b>
              </TableCell>
              <TableCell>
                <b>Cantidad</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id} sx={{ backgroundColor: "#e0e0e0" }}>
                <TableCell>
                  <Checkbox
                    checked={seleccionados.includes(pedido.id)}
                    onChange={() => toggleSeleccion(pedido.id)}
                  />
                </TableCell>
                <TableCell>{pedido.codigo}</TableCell>
                <TableCell>{pedido.nombre}</TableCell>
                <TableCell>{pedido.marca}</TableCell>
                <TableCell>{pedido.modelo}</TableCell>
                <TableCell>{pedido.descripcion}</TableCell>
                <TableCell>{pedido.cantidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        sx={{
          marginTop: 3,
          backgroundColor: "#ffeb3b",
          color: "black",
          borderRadius: "1.2rem",
        }}
        onClick={generarPresupuestos}
        disabled={seleccionados.length === 0}
      >
        Generar Presupuestos
      </Button>
    </Box>
  );
};

export default GeneradorPresupuestos;
