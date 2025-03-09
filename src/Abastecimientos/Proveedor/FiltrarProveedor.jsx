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
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../../context/Context";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const FiltrarProveedor = () => {
  const { IP, tokenError } = useContext(Context);
  const navigate = useNavigate();

  const [rubros, setRubros] = useState([
    "Motos y Vehículos",
    "Repuestos y Accesorios",
    "Indumentaria y Seguridad",
    "Lubricantes y Químicos",
    "Neumáticos",
    "Herramientas y Equipamiento",
    "Electrónica y Tecnología",
    "Servicios Mecánicos",
    "Financieras y Seguros",
    "Publicidad y Marketing",
    "Logística y Transporte",
  ]);
  const [rubroSeleccionado, setRubroSeleccionado] = useState("");
  const [proveedoresOriginales, setProveedoresOriginales] = useState([]); // Guarda todos los proveedores
  const [proveedores, setProveedores] = useState([]); // Guarda los proveedores filtrados
  const [paginas, setPaginas] = useState();
  const [filtroTexto, setFiltroTexto] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([
    "Nombre Proveedor",
    "Razón Social",
    "CUIT",
    "Teléfono",
    "Correo",
    "Rubro",
    "Ciudad",
  ]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const response = await fetch(`${IP}/api/proveedores/listar/1?all=1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.AuthErr) {
          tokenError(data.MENSAJE);
        } else if (data.ServErr || data.ERROR) {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: data.MENSAJE,
            color: "#fff",
            background: "#333",
            confirmButtonColor: "#3085d6",
          });
        } else {
          setProveedoresOriginales(data.ListaProv); // Guardar la lista completa
          setProveedores(data.ListaProv); // Usar la lista para mostrar
          setPaginas(data.TotalPaginas);
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
    fetchProveedores();
  }, [IP, tokenError]);

  const handleAgregarProveedor = () => {
    navigate("/alta-proveedor");
  };

  const filtrarProveedores = () => {
    return proveedores.filter((proveedor) =>
      Object.values(proveedor).some((valor) =>
        valor?.toString().toLowerCase().includes(filtroTexto.toLowerCase())
      )
    );
  };

  const handleActivar = async (cuit, activo) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    const endpoint = activo
      ? `${IP}/api/proveedores/desactivarProveedor`
      : `${IP}/api/proveedores/activarProveedor`;

    try {
      const response = await fetch(endpoint, {
        method: activo ? "DELETE" : "PUT", // DELETE para desactivar, PUT para activar
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Cuit: cuit }),
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

      // Actualizar el estado de los proveedores
      setProveedores((prevProveedores) =>
        prevProveedores.map((prov) =>
          prov.cuit === cuit ? { ...prov, activo: !activo } : prov
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

  const handleFiltrar = () => {
    if (rubroSeleccionado) {
      const filtrados = proveedoresOriginales.filter(
        (proveedor) => proveedor.rubro === rubroSeleccionado
      );
      setProveedores(filtrados);
    } else {
      setProveedores(proveedoresOriginales); // Si no hay rubro seleccionado, mostrar todos
    }
  };

 const handleLimpiar = () => {
  setRubroSeleccionado("");
  setProveedores(proveedoresOriginales); // Restaurar la lista completa
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

  const columnToProperty = {
    "Nombre Proveedor": "nombre",
    "Razón Social": "razon_social",
    CUIT: "cuit",
    Teléfono: "telefono",
    Correo: "correo",
    Dirección: "direccion",
    Ciudad: "ciudad",
    Provincia: "provincia",
    "Código Postal": "codigo_postal",
    "Tipo de Proveedor": "tipo_proveedor",
    Rubro: "rubro",
    Activo: "activo",
  };

  const renderTable = (columns, data) => (
    <TableContainer
      component={Paper}
      sx={{
        marginBottom: 4,
        borderRadius: 5,
      }}
    >
      <Table
        sx={{
          fontSize: "1.5rem",
          width: "800px",
          "& .MuiTableCell-root": {
            borderColor: "black",
            borderWidth: "1px",
          },
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column}
                sx={{
                  backgroundColor: "#ffeb3b",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                {column}
              </TableCell>
            ))}
            <TableCell
              sx={{
                backgroundColor: "#ffeb3b",
                fontWeight: "bold",
                fontSize: "1.2rem",
                borderColor: "black",
                textAlign: "center",
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  sx={{
                    backgroundColor: "#e0e0e0",
                    fontSize: "1rem",
                    borderColor: "black",
                    textAlign: "center",
                  }}
                >
                  {column === "Activo" ? (
                    row.activo ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )
                  ) : (
                    row[columnToProperty[column]]
                  )}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  textAlign: "center",
                  backgroundColor: "#e0e0e0",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    navigate(`/editar-proveedor/${row.cuit}`, {
                      state: { proveedor: row }, // Aquí pasas el proveedor completo con datos bancarios incluidos
                    })
                  }
                  sx={{
                    margin: 1,
                  }}
                >
                  <EditIcon />
                </Button>
                <Button
                  variant="contained"
                  color={row.activo ? "error" : "success"}
                  onClick={() => handleActivar(row.cuit, row.activo)}
                >
                  {row.activo ? "Desactivar" : "Activar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
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
        Listado de Proveedores
      </Typography>
      <Box display="flex" justifyContent="center" mb={2}>
        <TextField
          label="Rubro"
          select
          value={rubroSeleccionado}
          onChange={(e) => setRubroSeleccionado(e.target.value)}
          sx={{
            marginRight: 2,
            backgroundColor: "#ffeb3b",
            borderRadius: 2,
            minWidth: 200,
          }}
        >
          {rubros.map((rubro, index) => (
            <MenuItem key={index} value={rubro}>
              {rubro}
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

        <IconButton
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
        </IconButton>

        <IconButton
          variant="contained"
          onClick={handleAgregarProveedor}
          sx={{
            backgroundColor: "#ffeb3b",
            "&:hover": { backgroundColor: "#fdd835" },
            color: "#333",
            marginRight: 2,
          }}
        >
          <AddIcon />
        </IconButton>
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
      {renderTable(selectedColumns, filtrarProveedores())}{" "}
    </Box>
  );
};

export default FiltrarProveedor;
