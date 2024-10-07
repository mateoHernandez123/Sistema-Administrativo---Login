import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  CssBaseline,
} from "@mui/material";
import { Link } from "react-router-dom";

const usuario = "Mateo Hernandez";
const rolUsuario = "admin"; 
// Rol del usuario, puede cambiar según quién esté logueado

const opcionesMenu = [
  { text: "Cuentas", path: "/cuentas" },
  { text: "Asientos", path: "/asientos" },
  { text: "Diarios", path: "/diarios"},
  { text: "Mayores", path: "/mayores" },
  { text: "Resultados", path: "/resultados" },
  { text: "Usuarios", path: "/usuarios" },
];

const rolesPermisos = {
  admin: {
    Cuentas: true,
    Asientos: true,
    Diarios: true,
    Mayores: true,
    Resultados: true,
    Usuarios: true,
  },
  usuario: {
    Cuentas: true,
    Asientos: true,
    Diarios: true,
    Mayores: true,
    Resultados: false,
    Usuarios: false,
  },
};

// Filtrar opciones del menú según el rol del usuario
const opcionesMenuFiltradas = opcionesMenu.filter(
  (item) => rolesPermisos[rolUsuario][item.text]
);

const drawerWidth = 240;

const AppLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#ffeb3b",
          color: "black",
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

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#333",
            color: "#ffeb3b",
          },
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              backgroundColor: "yellow",
              padding: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderBottom: "1px solid black",
            }}
          >
            <Typography
              sx={{
                fontSize: 30,
                color: "black",
              }}
            >
              🏍️
            </Typography>
          </Box>
        </Link>

        {/* Renderizar el menú filtrado según los permisos */}
        <Box sx={{ overflow: "auto" }}>
          <List>
            {opcionesMenuFiltradas.map((item, index) => (
              <ListItem button component={Link} to={item.path} key={index}>
                <ListItemText primary={item.text} sx={{ color: "yellow" }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f5f5",
          p: 3,
          ml: `${drawerWidth}px`,
          mt: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
