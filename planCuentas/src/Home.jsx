import React from 'react';
import { Box } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#ffeb3b', // Fondo amarillo
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Imagen de una moto */}
      <img
        src="https://motos.espirituracer.com/archivos/2019/11/honda-cbr-600-rr-2004-4.jpg" // Reemplaza con la URL de tu imagen
        alt="Moto"
        style={{
          maxWidth: '80%',
          maxHeight: '80%',
        }}
      />
    </Box>
  );
};

export default Home;
