import { useState, useEffect, useContext } from "react";
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
  Checkbox,
  Button,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import { Context } from "../../context/Context";
import { useLocation } from "react-router-dom";

const AltaRemito = () => {
  const location = useLocation();
  const ordenSeleccionada = location.state?.orden;
  const [codigoOrden, setCodigoOrden] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [fechaRemito, setFechaRemito] = useState(
    new Date().toISOString().split("T")[0]
  ); // yyyy-MM-dd
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});
  const { IP, tokenError } = useContext(Context);

  useEffect(() => {
    const fetchPedidos = async (codigo) => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const resp = await fetch(`${IP}/api/orden-compra/listar/${codigo}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (data.AuthErr) return tokenError(data.MENSAJE);
        if (data.ERROR || data.ServErr) {
          return Swal.fire({
            title: "Error",
            icon: "error",
            text: data.MENSAJE,
          });
        }
        const orden = data.orden[0];
        setCodigoOrden(orden.codigo);
        setProveedor(ordenSeleccionada.proveedor);
        setProductos(
          (data.orden.pedidos || []).map((p) => ({
            id: p.codigo_pedido,
            codigo: p.codigo_pedido,
            nombre: p.nombre_producto,
            marca: p.marca_producto,
            modelo: p.modelo_producto,
            descripcion: p.descripcion_producto,
            cantidad: p.cantidad_pedido || 1,
          }))
        );
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error en la carga de datos",
          icon: "error",
          text: "Hubo un problema al conectar con el servidor.",
        });
      }
    };
    if (ordenSeleccionada?.codigo) {
      fetchPedidos(ordenSeleccionada.codigo);
    }
  }, [IP, tokenError, ordenSeleccionada]);

  const toggleSeleccion = (id) =>
    setSeleccionados((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleSeleccionTodos = () => {
    const all = productos.every((p) => seleccionados[p.id]);
    const nuevo = {};
    productos.forEach((p) => {
      nuevo[p.id] = !all;
    });
    setSeleccionados(nuevo);
  };

  const actualizarCantidad = (id, newQty) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: newQty } : p))
    );
  };

  const handleConfirmar = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const body = {
        fecha: fechaRemito,
        pedidos: productos
          .filter((p) => seleccionados[p.id])
          .map((p) => ({
            codigo_pedido: p.codigo,
            cantidad_recibida: p.cantidad,
          })),
      };
      const resp = await fetch(`${IP}/api/orden-compra/${codigoOrden}/remito`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const res = await resp.json();
      if (res.AuthErr) return tokenError(res.MENSAJE);
      if (res.ERROR || res.ServErr) {
        return Swal.fire({ title: "Error", icon: "error", text: res.MENSAJE });
      }
      Swal.fire({
        icon: "success",
        title: "Remito creado",
        text: "Remito exitoso.",
      });
      setProductos([]);
      setSeleccionados({});
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Fallo al crear remito.",
      });
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#e6e2d5", borderRadius: 5 }}>
      <Typography
        variant="h4"
        sx={{ mb: 2, color: "#333", fontWeight: "bold", textAlign: "center" }}
      >
        Alta de Remitos
      </Typography>
      <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
        <Typography variant="h6">Orden: {codigoOrden || "N/A"}</Typography>
        <Typography variant="h6">Proveedor: {proveedor || "N/A"}</Typography>
        <TextField
          label="Fecha de Remito"
          type="date"
          value={fechaRemito}
          onChange={(e) => setFechaRemito(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#ffeb3b" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    productos.length > 0 &&
                    productos.every((p) => seleccionados[p.id])
                  }
                  onChange={toggleSeleccionTodos}
                />
              </TableCell>
              <TableCell>
                <b>Código Pedido</b>
              </TableCell>
              <TableCell>
                <b>Nombre</b>
              </TableCell>
              <TableCell>
                <b>Marca</b>
              </TableCell>
              <TableCell>
                <b>Modelo</b>
              </TableCell>
              <TableCell>
                <b>Descripción</b>
              </TableCell>
              <TableCell>
                <b>Cantidad</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => (
              <TableRow key={prod.id} sx={{ bgcolor: "#e0e0e0" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!seleccionados[prod.id]}
                    onChange={() => toggleSeleccion(prod.id)}
                  />
                </TableCell>
                <TableCell>{prod.codigo}</TableCell>
                <TableCell>{prod.nombre}</TableCell>
                <TableCell>{prod.marca}</TableCell>
                <TableCell>{prod.modelo}</TableCell>
                <TableCell>{prod.descripcion}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    inputProps={{ min: 1 }}
                    sx={{ width: "80px" }}
                    value={prod.cantidad}
                    onChange={(e) =>
                      actualizarCantidad(
                        prod.id,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        sx={{
          mt: 3,
          bgcolor: "#ffeb3b",
          color: "black",
          borderRadius: "1.2rem",
        }}
        disabled={!Object.values(seleccionados).some((v) => v)}
        onClick={handleConfirmar}
      >
        Confirmar Remito
      </Button>
    </Box>
  );
};

export default AltaRemito;
