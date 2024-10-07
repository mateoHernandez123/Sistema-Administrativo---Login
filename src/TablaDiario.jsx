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

const TablaDiario = ({ datosLibro }) => {
  // Agrupar operaciones por número, fecha y tipo
  const operacionesAgrupadas = {};

  datosLibro.forEach((fila) => {
    const clave = `${fila.numero}-${fila.fecha}-${fila.tipo}`;
    if (!operacionesAgrupadas[clave]) {
      operacionesAgrupadas[clave] = {
        numero: fila.numero,
        fecha: fila.fecha,
        tipo: fila.tipo,
        operaciones: [],
      };
    }
    operacionesAgrupadas[clave].operaciones.push(fila);
  });

  // Convertir el objeto a un array para su uso en el render
  const grupos = Object.values(operacionesAgrupadas);

  // Calcular la sumatoria de Debe y Haber
  const totalDebe = datosLibro.reduce((acc, fila) => acc + fila.debe, 0);
  const totalHaber = datosLibro.reduce((acc, fila) => acc + fila.haber, 0);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Lista de Libro Diario
      </Typography>

      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table
          sx={{ minWidth: 700, fontSize: "1.4rem" }}
          aria-label="tabla libro diario"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                N°
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Fecha
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Operación
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
              >
                Debe
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
              >
                Haber
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Tipo
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grupos.map((grupo, grupoIndex) => {
              return grupo.operaciones.map((fila, index) => (
                <TableRow key={`${grupoIndex}-${index}`}>
                  {index === 0 && (
                    <TableCell
                      rowSpan={grupo.operaciones.length}
                      sx={{ fontSize: "1.1rem" }}
                    >
                      {grupo.numero}
                    </TableCell>
                  )}
                  {index === 0 && (
                    <TableCell
                      rowSpan={grupo.operaciones.length}
                      sx={{ fontSize: "1.1rem" }}
                    >
                      {grupo.fecha}
                    </TableCell>
                  )}
                  <TableCell
                    sx={{
                      fontSize: "1.1rem",
                      paddingLeft: fila.haber ? "30px" : "0px",
                    }}
                  >
                    {fila.operacion}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "1.1rem" }}>
                    {fila.debe !== 0 ? fila.debe.toFixed(2) : ""}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "1.1rem" }}>
                    {fila.haber !== 0 ? fila.haber.toFixed(2) : ""}
                  </TableCell>
                  {index === 0 && (
                    <TableCell
                      rowSpan={grupo.operaciones.length}
                      sx={{ fontSize: "1.1rem" }}
                    >
                      {grupo.tipo}
                    </TableCell>
                  )}
                </TableRow>
              ));
            })}
            {/* Fila Total */}
            <TableRow>
              <TableCell
                colSpan={3}
                align="right"
                sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
              >
                Total
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
              >
                {totalDebe.toFixed(2)}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
              >
                {totalHaber.toFixed(2)}
              </TableCell>
              <TableCell sx={{ fontSize: "1.1rem" }}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TablaDiario;
