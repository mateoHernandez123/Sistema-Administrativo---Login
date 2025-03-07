import { useState } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

const productosDisponibles = [
  { id: 1, codigo: "P001", nombre: "Producto A", marca: "Marca X", modelo: "X1", descripcion: "Descripción del Producto A" },
  { id: 2, codigo: "P002", nombre: "Producto B", marca: "Marca Y", modelo: "Y1", descripcion: "Descripción del Producto B" },
  { id: 3, codigo: "P003", nombre: "Producto C", marca: "Marca Z", modelo: "Z1", descripcion: "Descripción del Producto C" },
];

const Venta = () => {
  const [filtro, setFiltro] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState("");

  // Filtrar productos por nombre
  const productosFiltrados = productosDisponibles.filter((producto) =>
    producto.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  // Manejar selección del producto
  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(""); // Reiniciar cantidad
  };

  // Generar venta (simulado)
  const generarVenta = () => {
    if (!productoSeleccionado || cantidad <= 0) {
      alert("Seleccione un producto y una cantidad válida.");
      return;
    }
    alert(`Venta generada: ${productoSeleccionado.nombre} - Cantidad: ${cantidad}`);
    setProductoSeleccionado(null);
    setCantidad("");
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 5 }}>
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center", fontWeight: "bold" }}>
        Generar Venta
      </Typography>

      {/* Campo de búsqueda */}
      <TextField
        label="Buscar Producto"
        variant="outlined"
        fullWidth
        size="small"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Tabla de productos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#ffeb3b" }}>
            <TableRow>
              <TableCell><b>Código</b></TableCell>
              <TableCell><b>Nombre</b></TableCell>
              <TableCell><b>Marca</b></TableCell>
              <TableCell><b>Modelo</b></TableCell>
              <TableCell><b>Descripción</b></TableCell>
              <TableCell><b>Acción</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productosFiltrados.map((producto) => (
              <TableRow key={producto.id} sx={{ backgroundColor: "#e0e0e0" }}>
                <TableCell>{producto.codigo}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.marca}</TableCell>
                <TableCell>{producto.modelo}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => seleccionarProducto(producto)}
                  >
                    Seleccionar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {productosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Selección y generación de venta */}
      {productoSeleccionado && (
        <Box sx={{ marginTop: 3, padding: 2, backgroundColor: "#fff", borderRadius: 3 }}>
          <Typography variant="h6">
            Producto seleccionado: <b>{productoSeleccionado.nombre}</b>
          </Typography>
          <TextField
            label="Cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            inputProps={{ min: 1 }}
            size="small"
            sx={{ width: "120px", marginRight: 2 }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={generarVenta}
          >
            Generar Venta
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Venta;
