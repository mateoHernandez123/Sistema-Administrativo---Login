import React from 'react';
import { Box, Typography } from '@mui/material';

const ListaMayores = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Lista de Mayores</Typography>
      <ul>
        <li>Mayor 1</li>
        <li>Mayor 2</li>
        <li>Mayor 3</li>
      </ul>
    </Box>
  );
};

export default ListaMayores;
