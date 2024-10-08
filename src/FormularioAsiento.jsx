import { useState } from "react";
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

const FormularioAsiento = () => {
  const [filas, setFilas] = useState([
    { cuenta: "", debe: "", haber: "" }, // Una fila inicial
  ]);

  // Establecer la fecha actual en el estado
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const [fecha, setFecha] = useState(formattedDate);

  const [error, setError] = useState(""); // Estado para manejar el error de sumatoria

  // Manejar el cambio en los campos de una fila
  const handleFilaChange = (index, event) => {
    const { name, value } = event.target;
    const nuevasFilas = [...filas];

    // Si cambia el campo "Debe", poner "Haber" en 0
    if (name === "debe") {
      nuevasFilas[index].debe = value;
      nuevasFilas[index].haber = "0"; // Establecer "Haber" en 0 cuando "Debe" cambia
    }

    // Si cambia el campo "Haber", poner "Debe" en 0
    if (name === "haber") {
      nuevasFilas[index].haber = value;
      nuevasFilas[index].debe = "0"; // Establecer "Debe" en 0 cuando "Haber" cambia
    }

    // Para cambiar el valor de "Cuenta" normalmente
    if (name === "cuenta") {
      nuevasFilas[index].cuenta = value;
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
    console.log("Fecha:", fecha);
    console.log("Filas:", filas);
    console.log("Asiento creado correctamente");
    // Aquí puedes manejar el envío de datos al backend o la lógica que necesites
  };

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
          onChange={(e) => setFecha(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
          // Establecer el máximo como la fecha actual
          inputProps={{
            max: formattedDate,
          }}
          required
        />

        {/* Fila con los campos de cuenta, debe, haber, y eliminar */}
        {filas.map((fila, index) => (
          <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
            <Grid item xs={5}>
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
          sx={{ color: "black", borderColor: "black", marginBottom: 2 }}
          startIcon={<AddIcon />}
        >
          Agregar Fila
        </Button>

        {/* Botón para crear asiento */}
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ backgroundColor: "#3b3a31", color: "white", marginTop: 2 }}
        >
          Crear Asiento
        </Button>
      </form>
    </Box>
  );
};

export default FormularioAsiento;
