import { useContext, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";

const FormularioSolicitudCompra = () => {
  const navigate = useNavigate();
  const { IP, tokenError } = useContext(Context);
  const [formData, setFormData] = useState({
    categoriaSeleccionada: "",
    pedidos: [{ codigo: "", descripcion: "", cantidad: "" }],
    observacion: "",
  });
  const [error, setError] = useState("");

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

  const handleChange = (index, field, value) => {
    if (field === "categoriaSeleccionada") {
      setFormData((prev) => ({ ...prev, categoriaSeleccionada: value }));
    } else if (field === "observacion") {
      setFormData((prev) => ({ ...prev, observacion: value }));
    } else {
      const nuevosPedidos = [...formData.pedidos];
      nuevosPedidos[index][field] = value;
      setFormData((prev) => ({ ...prev, pedidos: nuevosPedidos }));
    }
  };

  const agregarProducto = () => {
    setFormData((prev) => ({
      ...prev,
      pedidos: [...prev.pedidos, { codigo: "", descripcion: "", cantidad: "" }],
    }));
  };

  const eliminarProducto = (index) => {
    if (formData.pedidos.length > 1) {
      setFormData((prev) => ({
        pedidos: prev.pedidos.filter((_, i) => i !== index),
      }));
    } else {
      setError("Debe haber al menos un producto en la lista.");
    }
  };

  const enviarSolicitud = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const response = await fetch(
        `${IP}/api/solicitud-compra/nuevasolicitud`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (data.AuthErr) {
        tokenError(data.MENSAJE);
      } else if (data.ServErr || data.ERROR) {
        Swal.fire({ title: "Error", icon: "error", text: data.MENSAJE });
      } else {
        Swal.fire({
          title: "Pedido Agregado",
          text: "Pedido agregado correctamente",
          icon: "success",
        });
        navigate("/solicitud-compra");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error en la carga de datos",
        icon: "error",
        text: "Hubo un problema al conectar con el servidor.",
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffeb3b",
        padding: 4,
        borderRadius: 5,
        maxWidth: "100%",
        margin: "auto",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Solicitud de Compra
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "#ffeb3b", borderRadius: 5 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Categoría</TableCell>
              <TableCell align="center">Producto</TableCell>
              <TableCell align="center">Descripción</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.pedidos.map((producto, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={formData.categoriaSeleccionada}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "categoriaSeleccionada",
                          e.target.value
                        )
                      }
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
                  <FormControl fullWidth>
                    <InputLabel>Producto</InputLabel>
                    <Select
                      value={producto.codigo}
                      onChange={(e) =>
                        handleChange(index, "codigo", e.target.value)
                      }
                    >
                      {(
                        productosPorCategoria[formData.categoriaSeleccionada] ||
                        []
                      ).map((prod, i) => (
                        <MenuItem key={i} value={prod}>
                          {prod}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    label="Descripción"
                    fullWidth
                    value={producto.descripcion}
                    onChange={(e) =>
                      handleChange(index, "descripcion", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Cantidad"
                    fullWidth
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleChange(index, "cantidad", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => eliminarProducto(index)}
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
        fullWidth
        onClick={agregarProducto}
        sx={{ mt: 2 }}
      >
        Agregar Producto
      </Button>
      <Typography variant="h5" sx={{ mt: 3 }}>
        Observaciones
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={formData.observacion}
        onChange={(e) => handleChange(null, "observacion", e.target.value)}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={enviarSolicitud}
        sx={{ mt: 2 }}
      >
        Crear Solicitud
      </Button>
    </Box>
  );
};

export default FormularioSolicitudCompra;
