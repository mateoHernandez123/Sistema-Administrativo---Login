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
  Checkbox,
  Button,
  TextField,
} from "@mui/material";
import Asiento from "../../Contable/Asientos/FormularioAsiento";

const AltaFactura = ({ ordenCompra }) => {
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});
  const [codigoFactura, setCodigoFactura] = useState("");

  useEffect(() => {
    if (ordenCompra) {
      setProductos(
        ordenCompra.productos.map((p) => ({
          ...p,
          precio: "", // Agregamos el precio vacío por defecto
        }))
      );
      setCodigoFactura(`REM-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [ordenCompra]);

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSeleccionTodos = () => {
    const todosSeleccionados = Object.values(seleccionados).every((s) => s);
    const nuevoEstado = {};
    productos.forEach((p) => {
      nuevoEstado[p.id] = !todosSeleccionados;
    });
    setSeleccionados(nuevoEstado);
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad } : p))
    );
  };

  const actualizarPrecio = (id, precio) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, precio } : p))
    );
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#e6e2d5", borderRadius: 5 }}>
      <Asiento />
      <Typography
        variant="h4"
        sx={{
          marginTop: 2,
          marginBottom: 2,
          color: "#333",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Alta de Factura
      </Typography>

      <TextField
        label="Número de Factura"
        value={codigoFactura}
        onChange={(e) => setCodigoFactura(e.target.value)}
        sx={{ marginBottom: 2, width: "100%" }}
      />

      <Typography variant="h6" sx={{ marginBottom: 2, color: "#000" }}>
        Proveedor: {ordenCompra?.proveedor || "N/A"}
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffeb3b" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    productos.length > 0 &&
                    productos.every((p) => seleccionados[p.id])
                  }
                  onChange={toggleSeleccionTodos}
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
              <TableCell>
                <b>Precio</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id} sx={{ backgroundColor: "#e0e0e0" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!seleccionados[producto.id]}
                    onChange={() => toggleSeleccion(producto.id)}
                  />
                </TableCell>
                <TableCell>{producto.codigo}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.marca}</TableCell>
                <TableCell>{producto.modelo}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) =>
                      actualizarCantidad(producto.id, e.target.value)
                    }
                    inputProps={{ min: 1 }}
                    size="small"
                    sx={{ width: "80px" }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={producto.precio}
                    onChange={(e) =>
                      actualizarPrecio(producto.id, e.target.value)
                    }
                    inputMode="decimal"
                    pattern="[0-9]+(\.[0-9]{1,2})?"
                    size="small"
                    sx={{ width: "100px" }}
                    placeholder="Ingresar precio"
                  />
                </TableCell>
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
        disabled={Object.values(seleccionados).every((s) => !s)}
      >
        Confirmar Factura
      </Button>
    </Box>
  );
};

// Ejemplo de datos ficticios
const ejemploOrdenCompra = {
  proveedor: "Proveedor A",
  productos: [
    {
      id: 1,
      codigo: "P001",
      nombre: "Producto 1",
      marca: "Marca A",
      modelo: "Modelo X",
      descripcion: "Descripción 1",
      cantidad: 1,
    },
    {
      id: 2,
      codigo: "P002",
      nombre: "Producto 2",
      marca: "Marca B",
      modelo: "Modelo Y",
      descripcion: "Descripción 2",
      cantidad: 2,
    },
    {
      id: 3,
      codigo: "P003",
      nombre: "Producto 3",
      marca: "Marca C",
      modelo: "Modelo Z",
      descripcion: "Descripción 3",
      cantidad: 1,
    },
  ],
};

export default function App() {
  return <AltaFactura ordenCompra={ejemploOrdenCompra} />;
}
