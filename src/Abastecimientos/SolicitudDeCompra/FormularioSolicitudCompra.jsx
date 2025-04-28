import { useContext, useEffect, useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Context } from "../../context/Context";

const FormularioSolicitudCompra = () => {
  const navigate = useNavigate();
  const { IP, tokenError } = useContext(Context);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    Pedidos: [{ codigo: "", descripcion: "", cantidad: "" }],
    Observaciones: "",
  });

  const [setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const response = await fetch(
          `${IP}/api/productos/listar?listartodo=1`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        if (data.AuthErr) {
          tokenError(data.MENSAJE);
        } else if (data.ERROR || data.ServErr) {
          Swal.fire({ title: "Error", icon: "error", text: data.MENSAJE });
        } else {
          setProductos(data.ListaProd || []);
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
    fetchProductos();
  }, [IP, tokenError]);

  const handleChange = (index, field, value) => {
    if (field === "Observaciones") {
      setFormData((prev) => ({ ...prev, Observaciones: value }));
    } else {
      const nuevosPedidos = [...formData.Pedidos];
      nuevosPedidos[index][field] = value;
      setFormData((prev) => ({ ...prev, Pedidos: nuevosPedidos }));
    }
  };

  const agregarProducto = () => {
    setFormData((prev) => ({
      ...prev,
      Pedidos: [...prev.Pedidos, { codigo: "", descripcion: "", cantidad: "" }],
    }));
  };

  const eliminarProducto = (index) => {
    if (formData.Pedidos.length > 1) {
      setFormData((prev) => ({
        ...prev,
        Pedidos: prev.Pedidos.filter((_, i) => i !== index),
      }));
    } else {
      setError("Debe haber al menos un producto en la lista.");
    }
  };

  const handleListarSolicitudes = () => {
    navigate("/solicitud-compra");
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
          body: JSON.stringify({
            Pedidos: formData.Pedidos,
            Observaciones: formData.Observaciones,
          }),
        }
      );

      const data = await response.json();

      if (data.AuthErr) {
        tokenError(data.MENSAJE);
      } else if (data.ERROR || data.ServErr) {
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
      <IconButton
        onClick={handleListarSolicitudes}
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
          marginBottom: 2,
          color: "#333",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Solicitud de Compra
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "#ffeb3b", borderRadius: 5 }}
      >
        <Table
          sx={{
            minWidth: 700,
            fontSize: "1.5rem",
            width: "800px",
            "& .MuiTableCell-root": {
              borderColor: "black", // Aplica color negro a las líneas de celda
              borderWidth: "1px", // Ajusta el grosor de las líneas
            },
          }}
          aria-label="tabla solicitud de compra"
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Producto
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Descripción
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Cantidad
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.Pedidos.map((producto, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  <FormControl sx={{ width: "auto", minWidth: 120 }}>
                    <InputLabel>Producto</InputLabel>
                    <Select
                      value={producto.codigo}
                      onChange={(e) =>
                        handleChange(index, "codigo", e.target.value)
                      }
                    >
                      {productos.map((prod) => (
                        <MenuItem key={prod.codigo} value={prod.codigo}>
                          {prod.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">
                  <TextField
                    label="Descripción"
                    fullWidth
                    value={producto.descripcion}
                    onChange={(e) =>
                      handleChange(index, "descripcion", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    label="Cantidad"
                    fullWidth
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleChange(index, "cantidad", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell align="center">
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
      <Typography variant="h5" sx={{ mt: 3 }}>
        Observaciones
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={formData.Observaciones}
        onChange={(e) => handleChange(null, "Observaciones", e.target.value)}
      />
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        fullWidth
        onClick={agregarProducto}
        sx={{
          color: "#3b3a31",
          borderColor: "#3b3a31",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        Agregar Producto
      </Button>
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={enviarSolicitud}
        sx={{ backgroundColor: "#3b3a31", color: "#ffff", marginTop: 2 }}
      >
        Crear Solicitud
      </Button>
    </Box>
  );
};

export default FormularioSolicitudCompra;
