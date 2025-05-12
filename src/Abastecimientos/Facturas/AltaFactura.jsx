/* import { useState, useEffect, useContext } from "react";
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
import Asiento from "../../Contable/Asientos/FormularioAsiento";


const AltaFactura = () => {
  const location = useLocation()
  const ordenSeleccionada = location.state?.orden;
  const [codigoOrden, setCodigoOrden] = useState("");
  const [proveedor, setProveedor] = useState("");
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
        console.log(data)
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

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSeleccionTodos = () => {
    const todosSeleccionados = Object.values(seleccionados).every((s) => s);
    const nuevoEstado = {};
    productos.forEach((p) => {
      nuevoEstado[p.id] = !todosSeleccionados;
    });
    setSeleccionados(nuevoEstado);
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad } : p))
    );
  };

  const actualizarPrecio = (id, precio) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, precio } : p))
    );
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#e6e2d5", borderRadius: 5 }}>
      <Asiento />
      <Typography
        variant="h4"
        sx={{
          marginTop: 2,
          marginBottom: 2,
          color: "#333",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Alta de Factura
      </Typography>
      <Typography variant="h6">Orden: {codigoOrden || "N/A"}</Typography>
      <Typography variant="h6" sx={{ marginBottom: 2, color: "#000" }}>
        Proveedor: {proveedor || "N/A"}
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffeb3b" }}>
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
                <b>Código</b>
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
              <TableCell>
                <b>Precio</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id} sx={{ backgroundColor: "#e0e0e0" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!seleccionados[producto.id]}
                    onChange={() => toggleSeleccion(producto.id)}
                  />
                </TableCell>
                <TableCell>{producto.codigo}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.marca}</TableCell>
                <TableCell>{producto.modelo}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) =>
                      actualizarCantidad(producto.id, e.target.value)
                    }
                    inputProps={{ min: 1 }}
                    size="small"
                    sx={{ width: "80px" }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={producto.precio}
                    onChange={(e) =>
                      actualizarPrecio(producto.id, e.target.value)
                    }
                    inputMode="decimal"
                    pattern="[0-9]+(\.[0-9]{1,2})?"
                    size="small"
                    sx={{ width: "100px" }}
                    placeholder="Ingresar precio"
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
          marginTop: 3,
          backgroundColor: "#ffeb3b",
          color: "black",
          borderRadius: "1.2rem",
        }}
        disabled={Object.values(seleccionados).every((s) => !s)}
      >
        Confirmar Factura
      </Button>
    </Box>
  );
};

// Ejemplo de datos ficticios
const ejemploOrdenCompra = {
  proveedor: "Proveedor A",
  productos: [
    {
      id: 1,
      codigo: "P001",
      nombre: "Producto 1",
      marca: "Marca A",
      modelo: "Modelo X",
      descripcion: "Descripción 1",
      cantidad: 1,
    },
    {
      id: 2,
      codigo: "P002",
      nombre: "Producto 2",
      marca: "Marca B",
      modelo: "Modelo Y",
      descripcion: "Descripción 2",
      cantidad: 2,
    },
    {
      id: 3,
      codigo: "P003",
      nombre: "Producto 3",
      marca: "Marca C",
      modelo: "Modelo Z",
      descripcion: "Descripción 3",
      cantidad: 1,
    },
  ],
};

export default function App() {
  return <AltaFactura ordenCompra={ejemploOrdenCompra} />;
}
 */

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
import Asiento from "../../Contable/Asientos/FormularioAsiento";

const AltaFactura = () => {
  const location = useLocation();
  const ordenSeleccionada = location.state?.orden;
  const [codigoOrden, setCodigoOrden] = useState("");
  const [proveedor, setProveedor] = useState("");
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
          return Swal.fire({ title: "Error", icon: "error", text: data.MENSAJE });
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
            precio: "", // El usuario ingresa el precio manualmente.
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

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSeleccionTodos = () => {
    const todosSeleccionados = Object.values(seleccionados).every((s) => s);
    const nuevoEstado = {};
    productos.forEach((p) => {
      nuevoEstado[p.id] = !todosSeleccionados;
    });
    setSeleccionados(nuevoEstado);
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: Math.max(1, parseInt(cantidad) || 1) } : p))
    );
  };

  const actualizarPrecio = (id, precio) => {
    const precioValido = /^\d+(\.\d{1,2})?$/.test(precio) ? precio : "";
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, precio: precioValido } : p))
    );
  };

  const handleConfirmar = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const body = {
        fecha: new Date().toISOString().split("T")[0], // Formato yyyy-MM-dd
        pedidos: productos
          .filter((p) => seleccionados[p.id])
          .map((p) => ({
            codigo_pedido: p.codigo,
            cantidad_facturada: p.cantidad,
            precio_unitario: p.precio, // Se envía el precio ingresado.
          })),
      };

      const resp = await fetch(`${IP}/api/orden-compra/${codigoOrden}/factura`, {
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

      Swal.fire({ icon: "success", title: "Factura creada", text: "La factura se registró exitosamente." });

      setProductos([]);
      setSeleccionados({});
    } catch (err) {
      console.error(err);
      Swal.fire({ title: "Error", icon: "error", text: "Fallo al crear factura." });
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#e6e2d5", borderRadius: 5 }}>
      <Asiento />
      <Typography
        variant="h4"
        sx={{ marginTop: 2, marginBottom: 2, color: "#333", fontWeight: "bold", textAlign: "center" }}
      >
        Alta de Factura
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
        <Typography variant="h6">Orden: {codigoOrden || "N/A"}</Typography>
        <Typography variant="h6">Proveedor: {proveedor || "N/A"}</Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffeb3b" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={productos.length > 0 && productos.every((p) => seleccionados[p.id])}
                  onChange={toggleSeleccionTodos}
                />
              </TableCell>
              <TableCell><b>Código</b></TableCell>
              <TableCell><b>Nombre</b></TableCell>
              <TableCell><b>Marca</b></TableCell>
              <TableCell><b>Modelo</b></TableCell>
              <TableCell><b>Descripción</b></TableCell>
              <TableCell><b>Cantidad</b></TableCell>
              <TableCell><b>Precio</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id} sx={{ backgroundColor: "#e0e0e0" }}>
                <TableCell padding="checkbox">
                  <Checkbox checked={!!seleccionados[producto.id]} onChange={() => toggleSeleccion(producto.id)} />
                </TableCell>
                <TableCell>{producto.codigo}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.marca}</TableCell>
                <TableCell>{producto.modelo}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>
                  <TextField type="number" value={producto.cantidad} onChange={(e) => actualizarCantidad(producto.id, e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField type="text" value={producto.precio} onChange={(e) => actualizarPrecio(producto.id, e.target.value)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" sx={{ mt: 3, bgcolor: "#ffeb3b", color: "black" }} disabled={!Object.values(seleccionados).some((v) => v)} onClick={handleConfirmar}>
        Confirmar Factura
      </Button>
    </Box>
  );
};

export default AltaFactura;
