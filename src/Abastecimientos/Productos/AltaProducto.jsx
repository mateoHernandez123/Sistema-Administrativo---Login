import { useState, useContext } from "react";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";

const AltaProducto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigoBarras: "",
    activo: true,
    nombre: "",
    marca: "",
    modelo: "",
    descripcion: "",
    precioVenta: "",
    ivaPorcentaje: "",
    stockMaximo: "",
    stockMinimo: "",
    puntoReposicion: "",
    categoria: "",
    almacen: "",
    url: "url.hola",
  });

  const { IP, tokenError } = useContext(Context);
  const categorias = [
    "Accesorios",
    "Cubiertas",
    "Lubricantes",
    "Filtros de aire",
    "Frenos",
    "Suspensión",
    "Escape",
    "Escape Deportivo",
    "Iluminación",
    "Baterías",
    "Transmisión",
    "Embrague",
    "Indumentaria",
    "Cascos",
    "Guantes",
    "Botas",
    "Protección",
    "Seguridad",
  ];

  const almacenes = ["Taller Mecanico", "Primer piso", "Planta baja"];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number" && value < 0) {
      Swal.fire({
        title: "Error",
        text: "Los valores numéricos deben ser positivos.",
        icon: "error",
      });
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleListarProductos = () => {
    navigate("/productos");
  };

  const handleSubmit = async () => {
    const {
      codigoBarras,
      nombre,
      marca,
      modelo,
      descripcion,
      precioVenta,
      ivaPorcentaje,
      stockMinimo,
      stockMaximo,
      puntoReposicion,
      categoria,
      almacen,
    } = formData;

    if (
      !codigoBarras ||
      !nombre ||
      !marca ||
      !modelo ||
      !descripcion ||
      !precioVenta ||
      !ivaPorcentaje
    ) {
      Swal.fire({
        title: "Error",
        text: "Por favor complete todos los campos obligatorios.",
        icon: "error",
      });
      return;
    }

    const producto = {
      Producto: {
        codigoBarras: codigoBarras || null,
        activo: true,
        nombre: nombre || null,
        marca: marca || null,
        modelo: modelo || null,
        descripcion: descripcion || null,
        precioVenta: precioVenta || null,
        ivaPorcentaje: ivaPorcentaje || null,
        stockActual: 0,
        stockMinimo: stockMinimo || null,
        stockMaximo: stockMaximo || null,
        puntoReposicion: puntoReposicion || null,
        categoria: categoria || null,
        almacen: almacen || null,
        url: "url.hola",
      },
    };

    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const response = await fetch(`${IP}/api/productos/alta`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      });

      const data = await response.json();

      if (data.AuthErr) {
        tokenError(data.MENSAJE);
      } else if (data.ServErr) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: data.MENSAJE,
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
      } else if (data.ERROR) {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: data.MENSAJE,
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          title: "Producto Agregado",
          text: "El producto ha sido registrado con éxito.",
          icon: "success",
        });
        handleListarProductos();
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

  return (
    <Box
      sx={{
        backgroundColor: "#ffeb3b",
        color: "black",
        padding: 4,
        borderRadius: 5,
        width: "900px",
        maxWidth: "100%",
        margin: "auto",
      }}
    >
      <IconButton
        onClick={handleListarProductos}
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
        Alta de Producto
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          label="Código de Barras"
          name="codigoBarras"
          value={formData.codigoBarras}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Marca"
          name="marca"
          value={formData.marca}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Modelo"
          name="modelo"
          value={formData.modelo}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Precio de Venta"
          name="precioVenta"
          type="number"
          inputProps={{ min: 0 }}
          value={formData.precioVenta}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="IVA %"
          name="ivaPorcentaje"
          type="number"
          inputProps={{ min: 0 }}
          value={formData.ivaPorcentaje}
          onChange={handleInputChange}
          margin="normal"
          required
        />
      </Box>

      <Typography variant="h6">Stock</Typography>
      <Box mb={3}>
        <TextField
          fullWidth
          label="Stock Máximo"
          name="stockMaximo"
          type="number"
          inputProps={{ min: 0 }}
          value={formData.stockMaximo}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Stock Mínimo"
          name="stockMinimo"
          type="number"
          inputProps={{ min: 0 }}
          value={formData.stockMinimo}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Punto de Reposición"
          name="puntoReposicion"
          type="number"
          inputProps={{ min: 0 }}
          value={formData.puntoReposicion}
          onChange={handleInputChange}
          margin="normal"
        />
      </Box>

      <Typography variant="h6">Otros</Typography>
      <Box mb={3}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Categoría</InputLabel>
          <Select
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria} value={categoria}>
                {categoria}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Almacén</InputLabel>
          <Select
            name="almacen"
            value={formData.almacen}
            onChange={handleInputChange}
          >
            {almacenes.map((almacen) => (
              <MenuItem key={almacen} value={almacen}>
                {almacen}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        onClick={handleSubmit}
        sx={{ backgroundColor: "#3b3a31", color: "#ffff", marginTop: 2 }}
      >
        Registrar Producto
      </Button>
    </Box>
  );
};

export default AltaProducto;
