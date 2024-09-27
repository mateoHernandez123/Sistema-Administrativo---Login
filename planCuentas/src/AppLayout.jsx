import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Box, CssBaseline } from '@mui/material';
import { Link } from 'react-router-dom'; // Importamos Link para manejar las rutas

const usuario = "Franco Liciaga";

const opcionesMenu = [
  { text: 'Cuentas', path: '/cuentas' },
  { text: 'Asientos', path: '/asientos' },
  { text: 'Mayores', path: '/mayores' },
  { text: 'Resultados', path: '/resultados' },
  { text: 'Usuarios', path: '/usuarios' }
];

const drawerWidth = 240;

const AppLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Cabecera */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#ffeb3b',
          color: 'black',
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {usuario}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Barra lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#333', color: '#ffeb3b' },
        }}
      >
        {/* Botón de Home (Logo de la moto) */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              backgroundColor: 'yellow', // Fondo amarillo
              padding: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottom: '1px solid black',
            }}
          >
            <Typography
              sx={{
                fontSize: 30,
                color: 'black', // Moto en negro
              }}
            >
              🏍️
            </Typography>
          </Box>
        </Link>

        {/* Lista de opciones del menú */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {opcionesMenu.map((item, index) => (
              <ListItem button component={Link} to={item.path} key={index}>
                <ListItemText
                  primary={item.text}
                  sx={{ color: 'yellow' }}  /* Color de la tipografía */
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3, ml: `${drawerWidth}px`, mt: '64px' }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
