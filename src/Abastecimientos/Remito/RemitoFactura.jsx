import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const proveedores = [
  { id: 1, nombre: "Proveedor A" },
  { id: 2, nombre: "Proveedor B" },
];

const productos = [
  { id: 1, nombre: "Producto 1", proveedorId: 1 },
  { id: 2, nombre: "Producto 2", proveedorId: 1 },
  { id: 3, nombre: "Producto 3", proveedorId: 2 },
  { id: 4, nombre: "Producto 4", proveedorId: 2 },
];

const FacturaRemito = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [form, setForm] = useState({ proveedor: "", productos: [] });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductoChange = (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, productos: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire("Datos enviados", JSON.stringify(form, null, 2), "success");
  };

  const productosFiltrados = productos.filter(
    (p) => p.proveedorId === form.proveedor
  );

  return (
    <Box sx={{ width: "900px", margin: "auto", padding: 3, borderRadius: 5 }}>
      <IconButton sx={{ color: "#333" }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        Gestión de Factura y Remito
      </Typography>
      <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)}>
        <Tab label="Factura / Remito" />
      </Tabs>

      {tabIndex === 0 && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
            margin: "auto",
          }}
        >
          <Typography variant="h6">Factura y Remito</Typography>
          <TextField
            select
            label="Proveedor"
            name="proveedor"
            value={form.proveedor}
            onChange={handleChange}
            fullWidth
          >
            {proveedores.map((prov) => (
              <MenuItem key={prov.id} value={prov.id}>
                {prov.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Productos"
            name="productos"
            value={form.productos}
            onChange={handleProductoChange}
            fullWidth
            SelectProps={{ multiple: true }}
          >
            {productosFiltrados.map((prod) => (
              <MenuItem key={prod.id} value={prod.id}>
                {prod.nombre}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained">
            Enviar
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FacturaRemito;
