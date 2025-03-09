import { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Context } from "../../context/Context";
import axios from "axios";

const EditarProveedor = () => {
  const { IP, tokenError } = useContext(Context);
  const navigate = useNavigate();
  const { cuit } = useParams();
  const location = useLocation();
  const proveedor = location.state?.proveedor || {};

  const [formData, setFormData] = useState({
    nombre: proveedor.nombre || "",
    razon_social: proveedor.razon_social || "",
    cuit: proveedor.cuit || "",
    telefono: proveedor.telefono || "",
    correo: proveedor.correo || "",
    direccion: proveedor.direccion || "",
    provincia: proveedor.provincia || "",
    ciudad: proveedor.ciudad || "",
    codigo_postal: proveedor.codigo_postal || "",
    tipo_proveedor: proveedor.tipo_proveedor || "",
    rubro: proveedor.rubro || "",
    banco: "",
    nro_cuenta: "",
    cbu: "",
    comentario: "",
    calificacion: "",
    activo: proveedor.activo || false,
  });

  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  // Obtener provincias al montar el componente
  useEffect(() => {
    axios
      .get("https://apis.datos.gob.ar/georef/api/provincias")
      .then((response) => {
        setProvincias(response.data.provincias);
      })
      .catch((error) => {
        console.error("Error al obtener provincias:", error);
      });
  }, []);

  // Obtener provincias al montar el componente
  useEffect(() => {
    if (formData.provincia) {
      axios
        .get(
          `https://apis.datos.gob.ar/georef/api/municipios?provincia=${formData.provincia}&campos=nombre&max=1000`
        )
        .then((response) => {
          setCiudades(response.data.municipios);
        })
        .catch((error) => {
          console.error("Error al obtener ciudades:", error);
        });
    }
  }, [formData.provincia]);

  // Manejar cambio de provincia y cargar ciudades
  const handleProvinciaChange = (e) => {
    const provinciaId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      provincia: provinciaId,
      ciudad: "",
      codigo_postal: "",
    }));

    axios
      .get(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${provinciaId}&campos=nombre&max=1000`
      )
      .then((response) => {
        setCiudades(response.data.municipios);
      })
      .catch((error) => {
        console.error("Error al obtener ciudades:", error);
      });
  };

  // Manejar cambio de ciudad
  const handleCiudadChange = (e) => {
    const ciudadSeleccionada = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      ciudad: ciudadSeleccionada,
      codigo_postal: "",
    }));
  };

  const handleRubroChange = (e) => {
    const rubroSeleccionado = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      rubro: rubroSeleccionado,
    }));
  };

  const handleTipoProveedorChange = (e) => {
    const tipoSeleccionado = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      tipo_proveedor: tipoSeleccionado,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const Cuit = formData.cuit;

      // Enviar los datos del formulario al backend para la actualización
      const updateResponse = await fetch(`${IP}/api/proveedores/modificar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Cuit, Datos: formData }),
      });

      const updateData = await updateResponse.json();

      if (updateData.AuthErr) {
        return tokenError(updateData.MENSAJE);
      } else if (updateData.ServErr) {
        return Swal.fire({
          title: "Error del Servidor",
          icon: "error",
          text: updateData.MENSAJE,
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
      } else if (updateData.ERROR) {
        return Swal.fire({
          icon: "warning",
          title: "Atención",
          text: updateData.MENSAJE,
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
      }

      // Éxito: Activación/Desactivación y Actualización Completadas
      Swal.fire({
        title: "Proveedor Actualizado",
        text: `Proveedor ${formData.nombre} actualizado correctamente`,
        icon: "success",
      });

      navigate("/proveedores");
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

  if (!formData) {
    return <Typography>Cargando...</Typography>;
  }

  const tiposProveedores = ["Minorista", "Mayorista", "Exportador", "Otro"];
  const rubros = [
    "Motos y Vehículos",
    "Repuestos y Accesorios",
    "Indumentaria y Seguridad",
    "Lubricantes y Químicos",
    "Neumáticos",
    "Herramientas y Equipamiento",
    "Electrónica y Tecnología",
    "Servicios Mecánicos",
    "Financieras y Seguros",
    "Publicidad y Marketing",
    "Logística y Transporte",
  ];

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
        onClick={() => navigate("/proveedores")}
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
        Editar Proveedor
      </Typography>
      <Box mb={2}>
        <Typography variant="h6">Datos Principales</Typography>
        <TextField
          label="Nombre del Proveedor"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Razón Social"
          name="razon_social"
          value={formData.razon_social}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="CUIT"
          name="cuit"
          value={formData.cuit}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Correo Electrónico"
          name="correo"
          value={formData.correo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <Typography variant="h6">Ubicación</Typography>
        <Box mb={3}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Provincia</InputLabel>
            <Select
              name="provincia"
              value={formData.provincia}
              onChange={handleProvinciaChange}
              type="text"
            >
              {provincias.map((provincia) => (
                <MenuItem key={provincia.id} value={provincia.nombre}>
                  {provincia.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Ciudad</InputLabel>
            <Select
              name="ciudad"
              value={formData.ciudad}
              onChange={handleCiudadChange}
              type="text"
            >
              {ciudades.map((ciudad) => (
                <MenuItem key={ciudad.id} value={ciudad.nombre}>
                  {ciudad.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Código Postal"
            name="codigo_postal"
            value={formData.codigo_postal}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Box>
      </Box>
      <Box mb={2}>
        <Typography variant="h6">Tipo y Rubro</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de Proveedor</InputLabel>
          <Select
            name="tipo_proveedor"
            value={formData.tipo_proveedor}
            onChange={handleTipoProveedorChange}
            type="text"
          >
            {tiposProveedores.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Rubro</InputLabel>
          <Select
            name="rubro"
            value={formData.rubro}
            onChange={handleRubroChange}
            type="text"
          >
            {rubros.map((rubro) => (
              <MenuItem key={rubro} value={rubro}>
                {rubro}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleSave}
          sx={{ backgroundColor: "#3b3a31", color: "#ffff", marginTop: 2 }}
        >
          Actualizar Proveedor
        </Button>
      </Box>
    </Box>
  );
};

export default EditarProveedor;
