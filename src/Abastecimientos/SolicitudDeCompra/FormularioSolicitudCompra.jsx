import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";

const FormularioSolicitudCompra = () => {
  const today = new Date().toISOString().split("T")[0];
  const añoActual = new Date().getFullYear();
  const prefijo = `SC-${añoActual}-`;
  const [numero, setNumero] = useState("");
  const [numeroSolicitud, setNumeroSolicitud] = useState(prefijo);
  const [fechaSolicitud, setFechaSolicitud] = useState(today);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [productos, setProductos] = useState([
    { codigo: "", descripcion: "", cantidad: "", unidad: "" },
  ]);
  const [observacion, setObservacion] = useState("");
  const [error, setError] = useState("");

  // Opciones para los Select
  const departamentos = [
    "Taller mecanico",
    "Administracion",
    "Compras",
    "Ventas",
  ];
  const categoriasDisponibles = [
    "Libreria",
    "Motos",
    "Repuestos",
    "Ropa",
    "Electronica",
  ];
  const productosPorCategoria = {
    Libreria: ["Cuadernos", "Lapiceras", "Resaltadores"],
    Motos: ["Casco", "Guantes", "Cubiertas"],
    Repuestos: ["Filtro de aceite", "Bujía", "Amortiguadores"],
    Ropa: ["Campera", "Pantalón", "Botas"],
    Electronica: ["Celular", "Laptop", "Auriculares"],
  };

  const unidades = ["Unidad", "Caja", "Paquete", "Litro"];

  // Agregar un producto
  const agregarProducto = () => {
    setProductos([
      ...productos,
      { codigo: "", descripcion: "", cantidad: "", unidad: "" },
    ]);
  };

  useEffect(() => {
    setNumeroSolicitud(prefijo + numero);
  }, [numero, prefijo]); // Se actualiza cada vez que cambian numero o prefijo

  const handleChange = (event) => {
    const nuevoValor = event.target.value
      .replace(prefijo, "")
      .replace(/\D/g, ""); // Solo números
    setNumero(nuevoValor);
  };

  // Eliminar un producto
  const eliminarProducto = (index) => {
    if (productos.length > 1) {
      const nuevosProductos = productos.filter((_, i) => i !== index);
      setProductos(nuevosProductos);
    } else {
      setError("Debe haber al menos un producto en la lista.");
    }
  };

  // Manejar cambios en los campos de producto
  const handleProductoChange = (index, name, value) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][name] = value;
    setProductos(nuevosProductos);
  };

  const handleCategoriaChange = (event) => {
    setCategoriaSeleccionada(event.target.value);
  };

  // Validar y enviar la solicitud
  const enviarSolicitud = () => {
    if (
      !solicitante ||
      !departamento ||
      productos.some(
        (p) => !p.codigo || !p.descripcion || !p.cantidad || !p.unidad
      )
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const data = {
      numeroSolicitud,
      fechaSolicitud,
      solicitante,
      departamento,
      productos,
      observacion,
      estado: "Pendiente",
    };

    Swal.fire({
      icon: "success",
      title: "Solicitud Creada",
      text: "La solicitud de compra se ha generado correctamente.",
    });

    // Reiniciar campos
    setSolicitante("");
    setDepartamento("");
    setNumero("");
    setProductos([{ codigo: "", descripcion: "", cantidad: "", unidad: "" }]);
    setObservacion("");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffeb3b",
        color: "#3b3a31",
        padding: 4,
        borderRadius: 5,
        width: "100%",
        maxWidth: "100%",
        margin: "auto",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
        Solicitud de Compra
      </Typography>

      {/* Encabezado */}
      {/* <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Número de Solicitud"
            value={prefijo + numero}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fecha de Solicitud"
            type="date"
            value={fechaSolicitud}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Solicitante"
            value={solicitante}
            onChange={(e) => setSolicitante(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Departamento</InputLabel>
            <Select
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
            >
              {departamentos.map((dep, index) => (
                <MenuItem key={index} value={dep}>
                  {dep}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid> */}

      {/* Detalle de necesidades */}
      <Typography
        variant="h4"
        sx={{
          color: "#333",
          fontSize: "1.6rem",
          marginTop: 2,
          marginBottom: 2,
          borderBottom: "2px solid #000",
          paddingBottom: 1,
        }}
      >
        Detalles
      </Typography>

      <TableContainer
        component={Paper}
        fullWidth
        sx={{ backgroundColor: "#ffeb3b", marginBottom: 4, borderRadius: 5 }}
      >
        <Table
          fullWidth
          sx={{
            fontSize: "1.5rem",
            "& .MuiTableCell-root": {
              borderColor: "black", // Aplica color negro a las líneas de celda
              borderWidth: "0.4px", // Ajusta el grosor de las líneas
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              >
                Categoría
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              >
                Producto
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              >
                Descripción
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              >
                Cantidad
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              >
                Unidad
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody fullWidth>
            {productos.map((producto, index) => (
              <TableRow fullWidth key={index}>
                <TableCell>
                  <FormControl fullWidth sx={{ marginRight: 9 }}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={categoriaSeleccionada}
                      onChange={handleCategoriaChange}
                    >
                      {categoriasDisponibles.map((cat, i) => (
                        <MenuItem key={i} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth sx={{ marginRight: 9 }}>
                    <InputLabel>Producto</InputLabel>
                    <Select
                      value={producto.codigo}
                      onChange={(e) =>
                        handleProductoChange(index, "codigo", e.target.value)
                      }
                    >
                      {(productosPorCategoria[categoriaSeleccionada] || []).map(
                        (prod, i) => (
                          <MenuItem key={i} value={prod}>
                            {prod}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    name="descripcion"
                    label="Descripción"
                    value={producto.descripcion}
                    onChange={(e) =>
                      handleProductoChange(index, "descripcion", e.target.value)
                    }
                    fullWidth
                    sx={{ marginRight: 13 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="cantidad"
                    label="Cantidad"
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleProductoChange(index, "cantidad", e.target.value)
                    }
                    fullWidth
                    sx={{ marginRight: 13 }}
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth sx={{ marginRight: 9 }}>
                    <InputLabel>Unidad</InputLabel>
                    <Select
                      value={producto.unidad}
                      onChange={(e) =>
                        handleProductoChange(index, "unidad", e.target.value)
                      }
                    >
                      {unidades.map((unidad, i) => (
                        <MenuItem key={i} value={unidad}>
                          {unidad}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => eliminarProducto(index)}
                    color="error"
                    sx={{ marginLeft: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={agregarProducto}
        fullWidth
        sx={{
          color: "#3b3a31",
          borderColor: "#3b3a31",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        Agregar Producto
      </Button>

      {/* Observaciones */}
      <Typography
        variant="h4"
        sx={{
          color: "#333",
          fontSize: "1.6rem",
          marginTop: 2,
          marginBottom: 2,
          borderBottom: "2px solid #000",
          paddingBottom: 1,
        }}
      >
        Observaciones
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
      />

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ marginTop: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError("")}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Botón de enviar */}
      <Button
        variant="contained"
        color="success"
        onClick={enviarSolicitud}
        fullWidth
        sx={{ backgroundColor: "#3b3a31", color: "#ffff", marginTop: 2 }}
      >
        Crear Solicitud
      </Button>
    </Box>
  );
};

export default FormularioSolicitudCompra;
