import { useState, useEffect, useContext } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../../context/Context";

// Pasos de la solicitud
const steps = [
  "Inicio",
  "Presupuestada",
  "Comprometida",
  "Ingresada",
  
  "Finalizada",
];

// Estilo personalizado del conector
const CustomConnector = styled(StepConnector)({
  "& .MuiStepConnector-line": {
    borderColor: "#1976d2", // Azul
    borderWidth: 2,
  },
});

const DetalleSolicitud = () => {
  const { id } = useParams(); // "id" es el codigo_solicitud
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pedido, setPedido] = useState(null);
  const { IP, tokenError } = useContext(Context);

  useEffect(() => {
    const fetchSolicitud = async () => {
      setLoading(true);
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const response = await fetch(`${IP}/api/pedidos-compra/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.AuthErr) {
          tokenError(data.MENSAJE);
        } else if (data.ERROR || data.ServErr) {
          Swal.fire({ title: "Error", icon: "error", text: data.MENSAJE });
        } else {
          setPedido(data.pedido);
          // Setear el paso activo según el estado
          setActiveStep(data.pedido.estado || 0);
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error en la carga de datos",
          icon: "error",
          text: "Hubo un problema al conectar con el servidor.",
        });
      }
      setLoading(false);
    };

    fetchSolicitud();
  }, [id, IP, tokenError]);

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Cargando detalles de la solicitud...
      </Typography>
    );
  }

  if (!pedido) {
    return (
      <Typography variant="h6" align="center" color="error">
        Solicitud no encontrada.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", padding: "2rem" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Detalle de la Solicitud de Compra
      </Typography>

      {/* Progreso de la solicitud */}
      <Box sx={{ margin: "2rem 0" }}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<CustomConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    "&.Mui-active": {
                      color: "#1976d2",
                    },
                    "&.Mui-completed": {
                      color: "#388e3c",
                    },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Detalles de la solicitud */}
      <Paper elevation={3} sx={{ padding: "1.5rem", marginTop: "2rem" }}>
        <Typography variant="h6" gutterBottom>
          Información de la Solicitud
        </Typography>
        <Typography>
          <strong>N° Solicitud:</strong> {pedido.codigo}
        </Typography>
        <Typography>
          <strong>Cantidad solicitada:</strong> {pedido.cantidad}
        </Typography>
        <Typography>
          <strong>Precio Unitario:</strong>{" "}
          {pedido.precio_unitario || "No disponible"}
        </Typography>
        <Typography>
          <strong>Producto ID:</strong> {pedido.producto_id}
        </Typography>
      </Paper>
    </Box>
  );
};

export default DetalleSolicitud;
