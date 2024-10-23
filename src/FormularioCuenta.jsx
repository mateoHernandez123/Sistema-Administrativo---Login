import { useContext, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Context } from "./context/Context";

const FormularioCuenta = () => {
  const [cuentas, setCuentas] = useState([]);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    monto: "",
    tipo: "",
    habilitada: true,
  });

  const [loading, setLoading] = useState(false);

  const handleAgregarCuenta = () => {
    navigate("/alta-cuentas");
  };

  // Función para listar la categoría seleccionada
  const handleListarCategoria = (categoria) => {
    setLoading(true);
    setTimeout(() => {
      // Simular la respuesta del servidor según la categoría seleccionada
      if (categoria === "activos") {
        const activos = [
          {
            codigo: "1.01",
            nombre: "Caja",
            descripcion: "Dinero en efectivo",
            habilitada: true,
          },
          {
            codigo: "1.02",
            nombre: "Banco",
            descripcion: "Cuentas bancarias",
            habilitada: true,
          },
          {
            codigo: "1.03",
            nombre: "Inversiones",
            descripcion: "Inversiones a corto plazo",
            habilitada: false,
          },
          {
            codigo: "1.04",
            nombre: "Cuentas por Cobrar",
            descripcion: "Créditos a clientes",
            habilitada: true,
          },
          {
            codigo: "1.05",
            nombre: "Inventarios",
            descripcion: "Mercaderías disponibles para la venta",
            habilitada: true,
          },
        ];
        setCuentas(activos);
      }
      // Puedes agregar simulaciones para otras categorías como "pasivos", "patrimonio-neto", etc.
      setLoading(false);
    }, 1000); // Simula un retraso de 1 segundo
  };

  const { usuarioAutenticado, deslogear } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("UsuarioAutenticado"))) {
      deslogear();
      navigate("/login", { replace: true });
    }
  }, [usuarioAutenticado, navigate]);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        maxWidth: "500px", // Ajuste para hacer el formulario más estrecho
        margin: "auto",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Añadir una sombra suave
      }}
    >
      {/* Título y botón "+" */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ color: "#333" }}>
          Gestión de Cuentas
        </Typography>
        <IconButton
          onClick={handleAgregarCuenta}
          sx={{
            backgroundColor: "#ffeb3b",
            "&:hover": { backgroundColor: "#fdd835" },
            color: "#333",
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Botones para listar categorías */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#333",
          color: "#ffeb3b",
          mb: 2,
          "&:hover": {
            backgroundColor: "#555",
          },
        }}
        onClick={() => handleListarCategoria("activos")}
      >
        Listar Activos
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#333",
          color: "#ffeb3b",
          mb: 2,
          "&:hover": {
            backgroundColor: "#555",
          },
        }}
        onClick={() => handleListarCategoria("pasivos")}
      >
        Listar Pasivos
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#333",
          color: "#ffeb3b",
          mb: 2,
          "&:hover": {
            backgroundColor: "#555",
          },
        }}
        onClick={() => handleListarCategoria("patrimonio-neto")}
      >
        Listar Patrimonio Neto
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#333",
          color: "#ffeb3b",
          mb: 2,
          "&:hover": {
            backgroundColor: "#555",
          },
        }}
        onClick={() => handleListarCategoria("resultado-positivo")}
      >
        Listar Resultado Positivo
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#333",
          color: "#ffeb3b",
          mb: 2,
          "&:hover": {
            backgroundColor: "#555",
          },
        }}
        onClick={() => handleListarCategoria("resultado-negativo")}
      >
        Listar Resultado Negativo
      </Button>

      {/* Mostrar el listado de cuentas */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Listado de Cuentas
      </Typography>
      {loading ? (
        <Typography>Cargando cuentas...</Typography>
      ) : (
        <List>
          {cuentas.map((cuenta) => (
            <ListItem
              key={cuenta.codigo}
              sx={{ backgroundColor: "#fff", mb: 1, borderRadius: 1 }}
            >
              <ListItemText
                primary={`${cuenta.codigo} - ${cuenta.nombre}`}
                secondary={cuenta.descripcion}
              />
              <Checkbox checked={cuenta.habilitada} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FormularioCuenta;
