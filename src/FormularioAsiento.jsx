import { useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Context } from "./context/Context";
import { useNavigate } from "react-router-dom";

const FormularioAsiento = () => {
  const [filas, setFilas] = useState([
    { cuenta: "", debe: "", haber: "" }, // Una fila inicial
  ]);

  // Establecer la fecha actual en el estado
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const formattedTime = today.toTimeString().split(" ")[0].slice(0, 5); // HH:MM

  // Estados iniciales
  const [fecha, setFecha] = useState(formattedDate);
  const [hora, setHora] = useState(formattedTime);
  const [error, setError] = useState(""); // Estado para manejar el error de sumatoria
  const [fechaUltimoAsiento, setFechaUltimoAsiento] = useState("");
  const [horaUltimoAsiento, setHoraUltimoAsiento] = useState("");

  // Actualizar la hora actual cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setHora(currentTime.toTimeString().split(" ")[0].slice(0, 5)); // Actualizar a HH:MM
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(timer); // Limpiar intervalo al desmontar el componente
  }, []);

  // Simular la petición para obtener la fecha del último asiento
  useEffect(() => {
    const fetchUltimoAsiento = async () => {
      // Simulación de la fecha y hora del último asiento
      const ultimoAsiento = "2024-10-10T12:45"; // Ejemplo de respuesta simulada
      setFechaUltimoAsiento(ultimoAsiento.split("T")[0]); // Fecha en formato YYYY-MM-DD
      setHoraUltimoAsiento(ultimoAsiento.split("T")[1].slice(0, 5)); // Hora en formato HH:MM
    };

    fetchUltimoAsiento();
  }, []);

  // Manejar el cambio en el campo de fecha
  const handleFechaChange = (e) => {
    const selectedDate = e.target.value;

    // Validar que la fecha seleccionada esté dentro del rango permitido
    if (selectedDate >= fechaUltimoAsiento && selectedDate <= formattedDate) {
      setFecha(selectedDate);
      setError("");
    } else {
      setError("La fecha seleccionada no es válida.");
    }
  };

  // Manejar el cambio en el campo de hora
  const handleHoraChange = (e) => {
    const selectedTime = e.target.value;

    // Validar la hora dependiendo de la fecha seleccionada
    if (fecha === fechaUltimoAsiento && selectedTime < horaUltimoAsiento) {
      setError("La hora seleccionada es anterior al último asiento.");
    } else if (fecha === formattedDate && selectedTime > formattedTime) {
      setError("La hora seleccionada es en el futuro.");
    } else {
      setHora(selectedTime);
      setError(""); // Limpiar error
    }
  };

  // Manejar el cambio en los campos de una fila
  const handleFilaChange = async (index, event) => {
    const { name, value } = event.target;
    const nuevasFilas = [...filas];

    if (name === "codigo" || name === "cuenta") {
      nuevasFilas[index][name] = value;

      // Simulación de petición al servidor para completar el otro campo
      const cuentaSimulada = {
        codigo: "1.01",
        cuenta: "Caja",
      };
      // Si se ingresa el código, completar el nombre de la cuenta
      if (name === "codigo") {
        nuevasFilas[index].cuenta = cuentaSimulada.cuenta;
      } else {
        // Si se ingresa el nombre, completar el código
        nuevasFilas[index].codigo = cuentaSimulada.codigo;
      }
    }

    if (name === "debe") {
      nuevasFilas[index].debe = value;
      nuevasFilas[index].haber = "0";
    }

    if (name === "haber") {
      nuevasFilas[index].haber = value;
      nuevasFilas[index].debe = "0";
    }

    setFilas(nuevasFilas);
  };

  // Agregar una nueva fila
  const agregarFila = () => {
    setFilas([...filas, { cuenta: "", debe: "", haber: "" }]);
  };

  // Eliminar una fila
  const eliminarFila = (index) => {
    const nuevasFilas = filas.filter((_, i) => i !== index);
    setFilas(nuevasFilas);
  };

  // Calcular la sumatoria de las columnas "Debe" y "Haber"
  const calcularSumatorias = () => {
    const totalDebe = filas.reduce(
      (sum, fila) => sum + parseFloat(fila.debe || 0),
      0
    );
    const totalHaber = filas.reduce(
      (sum, fila) => sum + parseFloat(fila.haber || 0),
      0
    );
    return { totalDebe, totalHaber };
  };

  // Manejar el envío del formulario
  const crearAsiento = (event) => {
    event.preventDefault();

    const { totalDebe, totalHaber } = calcularSumatorias();

    if (totalDebe !== totalHaber) {
      setError(
        `La sumatoria del Debe (${totalDebe}) debe ser igual a la del Haber (${totalHaber}).`
      );
      return; // No permitir el envío del formulario
    }

    setError(""); // Limpiar el error si todo está bien
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
        backgroundColor: "#ffeb3b",
        color: "black",
        padding: 4,
        borderRadius: 2,
        width: "100%",
        maxWidth: "none",
        margin: "auto",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Alta de Asiento Contable
      </Typography>

      <form onSubmit={crearAsiento}>
        {/* Campo de fecha */}
        <TextField
          label="Fecha"
          type="date"
          name="fecha"
          value={fecha}
          onChange={handleFechaChange}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
          // Establecer el máximo como la fecha actual
          inputProps={{
            min: fechaUltimoAsiento, // Limitar la fecha mínima
            max: formattedDate, // Limitar la fecha máxima
          }}
          required
        />
        {/* Campo de hora */}
        <TextField
          label="Hora"
          type="time"
          name="hora"
          value={hora}
          onChange={handleHoraChange}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
          // Establecer el máximo como la hora actual
          inputProps={{
            min: fecha === fechaUltimoAsiento ? horaUltimoAsiento : undefined, // Limitar la hora mínima si es la fecha del último asiento
            max: fecha === formattedDate ? formattedTime : undefined, // Limitar la hora máxima si es la fecha actual
          }}
          required
        />

        {/* Fila con los campos de cuenta, debe, haber, y eliminar */}
        {filas.map((fila, index) => (
          <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
            <Grid item xs={2}>
              <TextField
                label="Código"
                name="codigo"
                value={fila.codigo}
                onChange={(event) => handleFilaChange(index, event)}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Cuenta"
                name="cuenta"
                value={fila.cuenta}
                onChange={(event) => handleFilaChange(index, event)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Debe"
                name="debe"
                value={fila.debe}
                onChange={(event) => handleFilaChange(index, event)}
                fullWidth
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*([.][0-9]{0,2})?",
                }}
                required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Haber"
                name="haber"
                value={fila.haber}
                onChange={(event) => handleFilaChange(index, event)}
                fullWidth
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*([.][0-9]{0,2})?",
                }}
                required
              />
            </Grid>
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton onClick={() => eliminarFila(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        {/* Mostrar el mensaje de error si la sumatoria no es igual */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        {/* Botón para agregar una fila nueva */}
        <Button
          variant="outlined"
          onClick={agregarFila}
          fullWidth
          sx={{ color: "#3b3a31", borderColor: "#3b3a31", marginBottom: 2 }}
          startIcon={<AddIcon />}
        >
          Agregar Fila
        </Button>

        {/* Botón para crear asiento */}
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ backgroundColor: "#3b3a31", color: "#ffff", marginTop: 2 }}
        >
          Crear Asiento
        </Button>
      </form>
    </Box>
  );
};

export default FormularioAsiento;
