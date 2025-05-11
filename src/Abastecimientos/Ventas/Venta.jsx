import { useState, useEffect, useContext } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { Context } from "../../context/Context";
import Swal from "sweetalert2";

const Venta = () => {
  const [productos, setProductos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const { IP, tokenError } = useContext(Context);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState("");

  const generarVenta = async () => {
    if (!productoSeleccionado || cantidad <= 0) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Seleccione un producto y una cantidad válida.",
        color: "#fff",
        background: "#333",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const response = await fetch(`${IP}/api/venta`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo: productoSeleccionado.codigo, // Se usa el código del producto seleccionado
          cantidad: cantidad,
        }),
      });

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
        Swal.fire({
          title: "Venta Generada",
          text: "El producto ha sido registrado con éxito.",
          icon: "success",
        });
        setProductoSeleccionado(null);
        setCantidad("");
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
          setProductos(data.ListaProd);
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

  const filtrarProductos = () => {
    return productos.filter((producto) =>
      Object.values(producto).some((valor) =>
        valor?.toString().toLowerCase().includes(filtroTexto.toLowerCase())
      )
    );
  };

  // Manejar selección del producto
  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(""); // Reiniciar cantidad
  };

  const renderTable = (data) => (
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
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1.4rem",
                textAlign: "center",
                backgroundColor: "#ffeb3b",
              }}
            >
              Código
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1.4rem",
                textAlign: "center",
                backgroundColor: "#ffeb3b",
              }}
            >
              Nombre
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1.4rem",
                textAlign: "center",
                backgroundColor: "#ffeb3b",
              }}
            >
              Marca
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1.4rem",
                textAlign: "center",
                backgroundColor: "#ffeb3b",
              }}
            >
              Modelo
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1.4rem",
                textAlign: "center",
                backgroundColor: "#ffeb3b",
              }}
            >
              Descripción
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "1.4rem",
                textAlign: "center",
                backgroundColor: "#ffeb3b",
              }}
            >
              Acción
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    fontSize: "1.1rem",
                    textAlign: "center",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  {row.codigo}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "1.1rem",
                    textAlign: "center",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  {row.nombre}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "1.1rem",
                    textAlign: "center",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  {row.marca}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "1.1rem",
                    textAlign: "center",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  {row.modelo}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "1.1rem",
                    textAlign: "center",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  {row.descripcion}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "1.1rem",
                    textAlign: "center",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => seleccionarProducto(row)}
                  >
                    Seleccionar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
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
        Venta de Productos
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <TextField
          label="Buscar Producto"
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
          sx={{
            backgroundColor: "#ffeb3b",
            color: "black",
            borderRadius: "1.2rem",
            marginRight: 2,
          }}
        >
          Filtrar
        </Button>
      </Box>

      {renderTable(filtrarProductos())}

      {/* Selección y generación de venta */}
      {productoSeleccionado && (
        <Box
          sx={{
            marginTop: 3,
            padding: 2,
            backgroundColor: "#fff",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6">
            Producto seleccionado: <b>{productoSeleccionado.nombre}</b>
          </Typography>
          <TextField
            label="Cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            inputProps={{ min: 1 }}
            size="small"
            sx={{ width: "120px", marginRight: 2 }}
          />
          <Button variant="contained" color="success" onClick={generarVenta}>
            Generar Venta
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Venta;
