import React from 'react';
import { Box, Typography } from '@mui/material';

const ListaResultados = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Lista de Resultados</Typography>
      <ul>
        <li>Resultado 1</li>
        <li>Resultado 2</li>
        <li>Resultado 3</li>
      </ul>
    </Box>
  );
};

export default ListaResultados;
