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
  IconButton,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import { Context } from "../../context/Context";

const VisualizarProducto = () => {
  const { codigo } = useParams();
  const location = useLocation();
  const producto = location.state?.producto || null;

  const [compras, setCompras] = useState([]);
  const navigate = useNavigate();
  const { IP } = useContext(Context);

  const handleListarProductos = () => {
    navigate("/productos");
  };

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const response = await fetch(
          `${IP}/api/productos/historialcompra?codigo=${codigo}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        if (data.ERROR) {
          Swal.fire(
            "Error",
            "No se pudo cargar el historial de compras",
            "error"
          );
        } else {
          setCompras(data.ListaProd || []);
          console.log(data);
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "No se pudo cargar el historial de compras",
          "error"
        );
        console.log(error);
      }
    };

    fetchCompras();
  }, [codigo, IP]);

  return (
    <Box sx={{ padding: 4, backgroundColor: "#e6e2d5", borderRadius: 5 }}>
      <IconButton
        color="primary"
        onClick={handleListarProductos}
        sx={{
          backgroundColor: "#ffeb3b",
          "&:hover": { backgroundColor: "#fdd835" },
          color: "#333",
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {producto ? (
        <>
          <Typography
            variant="h4"
            sx={{
              marginBottom: 4,
              color: "#333",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Detalles del Producto
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "#333" }}>
            <strong>Código:</strong> {producto.codigo}
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "#333" }}>
            <strong>Nombre:</strong> {producto.nombre}
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 4, color: "#333" }}>
            <strong>Descripción:</strong> {producto.descripcion}
          </Typography>

          <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "#333" }}>
            Historial de Compras
          </Typography>

          {compras.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Proveedor</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio Unitario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {compras.map((compra, index) => {
                    const fechaFormateada = new Date(
                      compra.fecha_hora
                    ).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });

                    const razon = compra.proveedor?.Razon || "—";
                    const cuit = compra.proveedor?.Cuit || "";

                    return (
                      <TableRow key={index}>
                        <TableCell>{fechaFormateada}</TableCell>
                        <TableCell>
                          {razon} <br />
                          <span style={{ fontSize: "0.85rem", color: "#666" }}>
                            {cuit}
                          </span>
                        </TableCell>
                        <TableCell>{compra.cantidad}</TableCell>
                        <TableCell>${compra.precio_unitario}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>
              No hay historial de compras para este producto.
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
          No se encontró el producto.
        </Typography>
      )}
    </Box>
  );
};

export default VisualizarProducto;
