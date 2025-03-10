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
  Button,
  MenuItem,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  Popover,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const FiltrarProductos = () => {
  const categorias = [
    "Accesorios",
    "Cubiertas",
    "Lubricantes",
    "Filtros de aire",
    "Frenos",
    "Suspensión",
    "Escape",
    "Escape Deportivo",
    "Iluminación",
    "Baterías",
    "Transmisión",
    "Embrague",
    "Indumentaria",
    "Cascos",
    "Guantes",
    "Botas",
    "Protección",
    "Seguridad",
  ];
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [productos, setProductos] = useState([]);
  const [paginas, setPaginas] = useState([]);

  const [filtroTexto, setFiltroTexto] = useState("");

  const [anchorEl, setAnchorEl] = useState(null); // Estado del Popover
  const [selectedColumns, setSelectedColumns] = useState([
    "Código",
    "Nombre",
    "Marca",
    "Modelo",
    "Categoría",
    "Stock Actual",
    "Precio de Venta",
    "Descripción",
    "Activo",
  ]);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { IP, tokenError } = useContext(Context);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const response = await fetch(
          `${IP}/api/productos/listar?listartodo=1`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.AuthErr) {
          tokenError(data.MENSAJE);
        } else if (data.ServErr) {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: data.MENSAJE,
            color: "#fff",
            background: "#333",
            confirmButtonColor: "#3085d6",
          });
        } else if (data.ERROR) {
          Swal.fire({
            icon: "warning",
            title: "Atención",
            text: data.MENSAJE,
            color: "#fff",
            background: "#333",
            confirmButtonColor: "#3085d6",
          });
        } else {
          setProductosOriginales(data.ListaProd);
          setProductos(data.ListaProd); // Establecer los productos
          setPaginas(data.TotalPaginas); //Establecer las paginas que se van a mostrar
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error en la carga de datos",
          icon: "error",
          text: "Hubo un problema al conectar con el servidor.",
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
      }
    };
    fetchProductos();
  }, [IP, tokenError]);

  const handleAgregarProducto = () => {
    navigate("/alta-producto");
  };

  const handleFiltrar = () => {
    if (categoriaSeleccionada) {
      const filtrados = productosOriginales.filter(
        (producto) => producto.categoria === categoriaSeleccionada
      );
      setProductos(filtrados);
    } else {
      setProductos(productosOriginales);
    }
  };

  const handleLimpiar = () => {
    setCategoriaSeleccionada("");
    setProductos(productosOriginales);
  };

  const handleActivar = async (codigo, activo) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    const endpoint = activo
      ? `${IP}/api/productos/desactivar`
      : `${IP}/api/productos/activar`;

    try {
      const response = await fetch(endpoint, {
        method: activo ? "DELETE" : "PUT", // DELETE para desactivar, PUT para activar
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Codigo: codigo }),
      });

      const data = await response.json();

      if (data.AuthErr) {
        return tokenError(data.MENSAJE);
      } else if (data.ServErr || data.ERROR) {
        return Swal.fire({
          title: "Error",
          icon: "error",
          text: data.MENSAJE,
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
      }

      // Actualizar el estado de los productos
      setProductos((prevProductos) =>
        prevProductos.map((prov) =>
          prov.codigo === codigo ? { ...prov, activo: !activo } : prov
        )
      );
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error en la carga de datos",
        icon: "error",
        text: "Hubo un problema al conectar con el servidor.",
        color: "#fff",
        background: "#333",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleColumnChange = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const filtrarProductos = () => {
    return productos.filter((producto) =>
      Object.values(producto).some((valor) =>
        valor?.toString().toLowerCase().includes(filtroTexto.toLowerCase())
      )
    );
  };

  // Mapeo de columnas a propiedades del producto
  const columnToProperty = {
    Código: "codigo",
    "Código de Barras": "codigo_barra",
    Nombre: "nombre",
    Marca: "marca",
    Categoría: "categoria",
    Modelo: "modelo",
    "Punto de Reposición": "punto_reposicion",
    Almacén: "almacen",
    Descripción: "descripcion",
    Imagen: "url_imagen",
    "Precio de Venta": "precio_venta",
    "Stock Actual": "stock_actual",
    "Stock Máximo": "stock_maximo",
    "Stock Mínimo": "stock_minimo",
    Activo: "activo",
  };

  const renderTable = (columns, data) => (
    <TableContainer component={Paper} sx={{ marginBottom: 4, borderRadius: 5 }}>
      <Table
        sx={{
          fontSize: "1.5rem",
          width: "100%",
          "& .MuiTableCell-root": { borderColor: "black", borderWidth: "1px" },
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column}
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                  textAlign: "center",
                  backgroundColor: "#ffeb3b",
                }}
              >
                {column}
              </TableCell>
            ))}
            <TableCell
              sx={{
                backgroundColor: "#ffeb3b",
                fontWeight: "bold",
                fontSize: "1.4rem",
                textAlign: "center",
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{
                      fontSize: "1.1rem",
                      textAlign: "center",
                      backgroundColor: "#e0e0e0",
                      borderColor: "black",
                    }}
                  >
                    {column === "Imagen" ? (
                      row[columnToProperty[column]] ? (
                        <img
                          src={row[columnToProperty[column]]}
                          alt={row.nombre}
                          style={{ width: 50, height: 50 }}
                        />
                      ) : (
                        "Sin imagen"
                      )
                    ) : column === "Activo" ? (
                      row.activo ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )
                    ) : (
                      row[columnToProperty[column]] ?? "N/A"
                    )}
                  </TableCell>
                ))}
                <TableCell
                  sx={{ textAlign: "center", backgroundColor: "#e0e0e0" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/editar-producto/${row.codigo}`, {
                        state: { producto: row },
                      })
                    }
                    sx={{ margin: 1 }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/visualizar-producto/${row.codigo}`)
                    }
                    sx={{ margin: 1 }}
                  >
                    <VisibilityIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color={row.activo ? "error" : "success"}
                    onClick={() => handleActivar(row.codigo, row.activo)}
                    sx={{ margin: 1 }}
                  >
                    {row.activo ? "Desactivar" : "Activar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                sx={{ textAlign: "center", fontSize: "1.2rem", color: "red" }}
              >
                No hay productos disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ padding: 4, backgroundColor: "#e6e2d5", borderRadius: 5 }}>
      <Typography
        variant="h4"
        sx={{
          marginBottom: 4,
          color: "#333",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Listado de Productos
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <TextField
            label="Categoría"
            select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            sx={{
              marginRight: 2,
              backgroundColor: "#ffeb3b",
              borderRadius: 2,
              minWidth: 200,
            }}
          >
            {categorias.map((categoria, index) => (
              <MenuItem key={index} value={categoria}>
                {categoria}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Buscar"
            variant="outlined"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            sx={{
              marginRight: 2,
              backgroundColor: "#ffeb3b",
              borderRadius: 2,
              minWidth: 200,
            }}
          />
          <Button
            variant="contained"
            onClick={handleFiltrar}
            sx={{
              backgroundColor: "#ffeb3b",
              color: "black",
              borderRadius: "1.2rem",
              marginRight: 2,
            }}
          >
            Filtrar
          </Button>

          <Button
            variant="contained"
            onClick={handleLimpiar}
            sx={{
              backgroundColor: "#ffeb3b",
              color: "black",
              marginRight: 5,
              borderRadius: "1.2rem",
            }}
          >
            Limpiar
          </Button>
        </Box>

        <Box>
          <Button
            variant="contained"
            onClick={handlePopoverOpen}
            sx={{
              backgroundColor: "#ffeb3b",
              "&:hover": { backgroundColor: "#fdd835" },
              color: "#333",
              borderRadius: "3rem",
              marginRight: 2,
            }}
          >
            <SettingsIcon />
          </Button>

          <IconButton
            variant="contained"
            onClick={handleAgregarProducto}
            sx={{
              backgroundColor: "#ffeb3b",
              "&:hover": { backgroundColor: "#fdd835" },
              color: "#333",
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column", // Asegura que las opciones se dispongan verticalmente
          }}
        >
          {Object.keys(columnToProperty).map((column) => (
            <FormControlLabel
              key={column}
              control={
                <Checkbox
                  checked={selectedColumns.includes(column)}
                  onChange={() => handleColumnChange(column)}
                />
              }
              label={column}
            />
          ))}
        </Box>
      </Popover>

      {renderTable(selectedColumns, filtrarProductos())}
    </Box>
  );
};

export default FiltrarProductos;
