import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrdenesCompraList = () => {
  const navigate = useNavigate();

  // Datos simulados de órdenes de compra
  const ordenesCompra = [
    {
      codigo: "OC-1001",
      proveedor: "Proveedor A",
      productos: [
        { id: "P001", nombre: "Producto 1", descripcion: "Descripción 1" },
        { id: "P002", nombre: "Producto 2", descripcion: "Descripción 2" },
      ],
    },
    {
      codigo: "OC-1002",
      proveedor: "Proveedor B",
      productos: [
        { id: "P003", nombre: "Producto 3", descripcion: "Descripción 3" },
        { id: "P004", nombre: "Producto 4", descripcion: "Descripción 4" },
      ],
    },
    {
      codigo: "OC-1003",
      proveedor: "Proveedor A",
      productos: [
        { id: "P002", nombre: "Producto 2", descripcion: "Descripción 2" },
        { id: "P005", nombre: "Producto 5", descripcion: "Descripción 5" },
      ],
    },
  ];

  // Estados para los filtros
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");

  // Filtrar órdenes de compra
  const ordenesFiltradas = ordenesCompra.filter((orden) => {
    const coincideProveedor = orden.proveedor
      .toLowerCase()
      .includes(filtroProveedor.toLowerCase());
    const coincideProducto = orden.productos.some((producto) =>
      producto.nombre.toLowerCase().includes(filtroProducto.toLowerCase())
    );

    return coincideProveedor && coincideProducto;
  });

  // Manejar selección de orden
  const manejarSeleccion = (orden) => {
    navigate("/alta-factura", { state: { orden } });
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 5 }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Órdenes de Compra</h2>

      {/* Campos de filtro */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Filtrar por Proveedor"
          variant="outlined"
          size="small"
          value={filtroProveedor}
          onChange={(e) => setFiltroProveedor(e.target.value)}
        />
        <TextField
          label="Filtrar por Producto"
          variant="outlined"
          size="small"
          value={filtroProducto}
          onChange={(e) => setFiltroProducto(e.target.value)}
        />
      </Box>

      {/* Tabla de órdenes de compra */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#ffeb3b" }}>
            <TableRow>
              <TableCell><b>Código de Orden</b></TableCell>
              <TableCell><b>Proveedor</b></TableCell>
              <TableCell><b>Código de Producto</b></TableCell>
              <TableCell><b>Nombre de Producto</b></TableCell>
              <TableCell><b>Descripción</b></TableCell>
              <TableCell><b>Acciones</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenesFiltradas.flatMap((orden) =>
              orden.productos.map((producto, index) => (
                <TableRow key={`${orden.codigo}-${producto.id}`} sx={{ backgroundColor: "#e0e0e0" }}>
                  <TableCell>{orden.codigo}</TableCell>
                  <TableCell>{orden.proveedor}</TableCell>
                  <TableCell>{producto.id}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.descripcion}</TableCell>
                  {index === 0 && ( // Solo mostrar el botón en la primera fila del grupo
                    <TableCell rowSpan={orden.productos.length}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => manejarSeleccion(orden)}
                      >
                        Seleccionar
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
            {ordenesFiltradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  No se encontraron órdenes de compra.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdenesCompraList;
