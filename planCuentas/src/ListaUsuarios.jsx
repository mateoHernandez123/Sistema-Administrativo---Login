import React from 'react';
import { Box, Typography } from '@mui/material';

const ListaUsuarios = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Lista de Usuarios</Typography>
      <ul>
        <li>Usuario 1</li>
        <li>Usuario 2</li>
        <li>Usuario 3</li>
      </ul>
    </Box>
  );
};

export default ListaUsuarios;
