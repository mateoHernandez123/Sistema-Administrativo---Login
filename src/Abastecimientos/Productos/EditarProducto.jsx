import { useState, useEffect, useContext } from "react";
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/Context";

const EditarProducto = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { IP, tokenError } = useContext(Context);
  const location = useLocation();
  const producto = location.state?.producto || {};
  const [formData, setFormData] = useState({
    codigo: producto.codigo || "",
    codigoBarra: producto.codigo_barra || "",
    nombre: producto.nombre || "",
    marca: producto.marca || "",
    categoria: producto.categoria || "",
    modelo: producto.modelo || "",
    puntoReposicion: producto.punto_reposicion || 0,
    almacen: producto.almacen || "",
    urlImagen: producto.url_imagen || "",
    descripcion: producto.descripcion || "",
    precioVenta: producto.precio_venta || 0,
    stockActual: producto.stock_actual || 0,
    stockMaximo: producto.stock_maximo || 0,
    stockMinimo: producto.stock_minimo || 0,
    ivaPorcentaje: producto.iva_porcentaje || 0,
  });

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
    let newValue = type === "number" ? Number(value) : value;

    if (type === "number" && newValue < 0) {
      Swal.fire("Error", "Los valores numéricos deben ser positivos.", "error");
      return;
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleListarProductos = () => navigate("/productos");

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const response = await fetch(`${IP}/api/productos/modificacion`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Producto: formData }),
      });

      const data = await response.json();
      if (data.AuthErr) return tokenError(data.MENSAJE);
      if (data.ServErr || data.ERROR) {
        return Swal.fire("Error", data.MENSAJE, "error");
      }

      Swal.fire(
        "Producto Actualizado",
        `Producto ${formData.nombre} actualizado correctamente`,
        "success"
      );
      navigate("/productos");
    } catch (error) {
      Swal.fire(
        "Error",
        "Hubo un problema al conectar con el servidor.",
        "error"
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      codigo,
      codigo_barra,
      nombre,
      marca,
      modelo,
      precio_venta,
      iva_porcentaje,
      stock_maximo,
      stock_minimo,
      categoria,
      almacen,
    } = formData;

    if (
      !codigo ||
      !codigo_barra ||
      !nombre ||
      !marca ||
      !modelo ||
      !precio_venta ||
      !iva_porcentaje ||
      !stock_maximo ||
      !stock_minimo ||
      !categoria ||
      !almacen
    ) {
      Swal.fire(
        "Error",
        "Por favor complete todos los campos obligatorios.",
        "error"
      );
      return;
    }
    handleSave();
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
        color="primary"
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
        sx={{ marginBottom: 4, textAlign: "center", fontWeight: "bold" }}
      >
        Editar Producto
      </Typography>

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Código"
          name="codigo"
          value={formData.codigo}
          disabled
        />
        <TextField
          label="Código de Barras"
          name="codigoBarra"
          value={formData.codigoBarra}
          onChange={handleInputChange}
        />
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
        />
        <TextField
          label="Marca"
          name="marca"
          value={formData.marca}
          onChange={handleInputChange}
        />
        <TextField
          label="Modelo"
          name="modelo"
          value={formData.modelo}
          onChange={handleInputChange}
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
        />
        <TextField
          label="Precio de Venta"
          name="precioVenta"
          type="number"
          value={formData.precioVenta}
          onChange={handleInputChange}
        />
        <TextField
          label="IVA"
          name="ivaPorcentaje"
          type="number"
          value={formData.ivaPorcentaje}
          onChange={handleInputChange}
        />
        <TextField
          label="Stock Maximo"
          name="stockMaximo"
          type="number"
          value={formData.stockMaximo}
          onChange={handleInputChange}
        />
        <TextField
          label="Stock Minimo"
          name="stockMinimo"
          type="number"
          value={formData.stockMinimo}
          onChange={handleInputChange}
        />

        <FormControl>
          <InputLabel>Categoría</InputLabel>
          <Select
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
          >
            {categorias.map((cat, i) => (
              <MenuItem key={i} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Almacén</InputLabel>
          <Select
            name="almacen"
            value={formData.almacen}
            onChange={handleInputChange}
          >
            {almacenes.map((alm, i) => (
              <MenuItem key={i} value={alm}>
                {alm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ backgroundColor: "#3b3a31", color: "#ffff", marginTop: 2 }}
        >
          Actualizar Producto
        </Button>
      </Box>
    </Box>
  );
};

export default EditarProducto;
