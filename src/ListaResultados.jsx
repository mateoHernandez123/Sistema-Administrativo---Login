import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ListaResultados = () => {
  // Datos de Patrimonio Neto
  const datosPNInicio = [
    { activos: 2000, pasivos: 3750, patrimonioNeto: 2650 },
    { activos: 3700, pasivos: 1200, patrimonioNeto: 4900 },
    { activos: 0, pasivos: 0, patrimonioNeto: 9800 }, // Línea en blanco para completar
  ];

  const datosPNCierre = [
    { activos: 5850, pasivos: 4200, patrimonioNeto: 6900 },
    { activos: 3950, pasivos: 850, patrimonioNeto: 6800 },
    { activos: 0, pasivos: 0, patrimonioNeto: 11000 }, // Línea en blanco para completar
  ];

  // Datos del Estado de Resultados
  const estadoResultados = [
    { descripcion: "Ventas", cantidad: 4300 },
    { descripcion: "CMV", cantidad: -2900 },
    { descripcion: "Utilidad bruta", cantidad: 1400 },
    { descripcion: "Gastos por publicidad", cantidad: -300 },
    { descripcion: "Intereses por mora", cantidad: -250 },
    { descripcion: "Descuento obtenido", cantidad: 350 },
    { descripcion: "Resultado", cantidad: 1200 },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ fontSize: "2rem" }}>
        Lista de Resultados
      </Typography>

      {/* Tabla de Patrimonio Neto al Inicio */}
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", marginTop: 3, fontSize: "1.5rem" }}
      >
        Patrimonio Neto al Inicio
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Activos
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Pasivos
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Patrimonio Neto
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosPNInicio.map((fila, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {fila.activos}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {fila.pasivos}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {fila.patrimonioNeto}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tabla de Patrimonio Neto al Cierre */}
      <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        Patrimonio Neto al Cierre
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Activos
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Pasivos
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Patrimonio Neto
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosPNCierre.map((fila, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {fila.activos}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {fila.pasivos}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {fila.patrimonioNeto}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Estado de Resultados */}
      <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        Estado de Resultados
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Descripción
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Cantidad
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estadoResultados.map((fila, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {fila.descripcion}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>
                  {fila.cantidad}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListaResultados;
