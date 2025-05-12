import { useContext, useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../../context/Context";

const OrdenesCompraList = () => {
  const navigate = useNavigate();
  const { IP, tokenError } = useContext(Context);
  const [ordenCompra, setOrdenCompra] = useState([]);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const response = await fetch(`${IP}/api/orden-compra/listar`, {
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
          const agrupadoPorOrden = data.lista.reduce((acc, item) => {
            const existente = acc.find((o) => o.codigo === item.codigo_orden);
            const producto = {
              id: item.codigo_producto,
              nombre: item.nombre_producto,
              descripcion: item.descripcion_producto,
            };

            if (existente) {
              existente.productos.push(producto);
            } else {
              acc.push({
                codigo: item.codigo_orden,
                proveedor: `${item.razon_social_proveedor} (${item.cuit_proveedor})`,
                productos: [producto],
              });
            }

            return acc;
          }, []);
          setOrdenCompra(agrupadoPorOrden);
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
    fetchOrdenes();
  }, [IP, tokenError]);

  // Estados para los filtros
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");

  // Filtrar órdenes de compra
  const ordenesFiltradas = ordenCompra.filter((orden) => {
    const coincideProveedor = orden.proveedor
      ?.toLowerCase()
      .includes(filtroProveedor.toLowerCase());

    const coincideProducto = orden.productos.some((producto) =>
      producto.nombre.toLowerCase().includes(filtroProducto.toLowerCase())
    );

    return coincideProveedor && coincideProducto;
  });

  // Manejar selección de orden
  const manejarSeleccion = (orden) => {
    navigate("/alta-remito", { state: { orden } });
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 5 }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Órdenes de Compra</h2>

      {/* Campos de filtro */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Filtrar por Proveedor"
          variant="outlined"
          size="small"
          value={filtroProveedor}
          onChange={(e) => setFiltroProveedor(e.target.value)}
        />
        <TextField
          label="Filtrar por Producto"
          variant="outlined"
          size="small"
          value={filtroProducto}
          onChange={(e) => setFiltroProducto(e.target.value)}
        />
      </Box>

      {/* Tabla de órdenes de compra */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#ffeb3b" }}>
            <TableRow>
              <TableCell>
                <b>Código de Orden</b>
              </TableCell>
              <TableCell>
                <b>Proveedor</b>
              </TableCell>
              <TableCell>
                <b>Código de Producto</b>
              </TableCell>
              <TableCell>
                <b>Nombre de Producto</b>
              </TableCell>
              <TableCell>
                <b>Descripción</b>
              </TableCell>
              <TableCell>
                <b>Acciones</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenesFiltradas.length > 0 ? (
              ordenesFiltradas.map((orden) =>
                orden.productos.map((producto, indexProducto) => (
                  <TableRow
                    key={`${orden.codigo}-${producto.id}`}
                    sx={{ backgroundColor: "#e0e0e0" }}
                  >
                    {indexProducto === 0 && (
                      <>
                        <TableCell rowSpan={orden.productos.length}>
                          {orden.codigo}
                        </TableCell>
                        <TableCell rowSpan={orden.productos.length}>
                          {orden.proveedor}
                        </TableCell>
                      </>
                    )}
                    <TableCell>{producto.id}</TableCell>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    {indexProducto === 0 && (
                      <TableCell rowSpan={orden.productos.length}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => manejarSeleccion(orden)}
                        >
                          Seleccionar
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  No se encontraron órdenes de compra.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdenesCompraList;
