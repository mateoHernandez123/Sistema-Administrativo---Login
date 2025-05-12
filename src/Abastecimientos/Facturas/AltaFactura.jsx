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
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
/* 
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
 */

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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

const AltaFactura = () => {
  const location = useLocation();
  const ordenSeleccionada = location.state?.orden;
  const { IP, tokenError } = useContext(Context);

  // Estados propios de la factura
  const [codigoOrden, setCodigoOrden] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});
  const [cuentasHojas, setCuentasHojas] = useState([]);

  // Estados para la vista del asiento (fecha y hora de la vista)
  const today = new Date();
  const [fecha, setFecha] = useState(today.toISOString().split("T")[0]);
  const [hora, setHora] = useState(today.toTimeString().split(" ")[0].slice(0, 5));

  // Actualiza la hora cada minuto para la vista del asiento
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setHora(now.toTimeString().split(" ")[0].slice(0, 5));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch de las cuentas hojas (para buscar las cuentas "Mercaderías" y "Documentos a pagar")
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    fetch(`${IP}/api/cuentas/obtenerhojas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.AuthErr) {
          tokenError(result.MENSAJE);
        } else if (result.ServErr || result.ERROR) {
          Swal.fire({ title: "Error", icon: "error", text: result.MENSAJE });
        } else {
          setCuentasHojas(result.Hojas);
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar las cuentas",
          icon: "error",
        });
      });
  }, [IP, tokenError]);

  // Fetch de la orden y sus productos
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

  // Funciones para manejar la selección y actualización de productos
  const toggleSeleccion = (id) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSeleccionTodos = () => {
    const todosSeleccionados =
      productos.length > 0 && productos.every((p) => seleccionados[p.id]);
    const nuevoEstado = {};
    productos.forEach((p) => {
      nuevoEstado[p.id] = !todosSeleccionados;
    });
    setSelecccionados(nuevoEstado);
    setSeleccionados(nuevoEstado);
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, cantidad: Math.max(1, parseInt(cantidad) || 1) }
          : p
      )
    );
  };

  const actualizarPrecio = (id, precio) => {
    const precioValido = /^\d+(\.\d{1,2})?$/.test(precio) ? precio : "";
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, precio: precioValido } : p))
    );
  };

  // Total de la factura (suma de precio * cantidad de los productos seleccionados)
  const totalFactura = productos
    .filter((p) => seleccionados[p.id])
    .reduce(
      (sum, p) =>
        sum + (parseFloat(p.precio) || 0) * (parseInt(p.cantidad) || 1),
      0
    );

  // Extrae las cuentas para Mercaderías y Documentos a pagar de las hojas obtenidas.
  const mercaderiasCuentaObj = cuentasHojas.find((c) =>
    c.nombre.toLowerCase().includes("mercader")
  );
  const documentosCuentaObj = cuentasHojas.find((c) =>
    c.nombre.toLowerCase().includes("documentos a pagar")
  );
  const codigoMercaderias = mercaderiasCuentaObj ? mercaderiasCuentaObj.codigo : "1.3.1";
  const codigoDocumentos = documentosCuentaObj ? documentosCuentaObj.codigo : "2.1.3";

  // Función que integra primero el alta de factura y luego la creación del asiento.
  const handleConfirmar = async () => {
    if (!Object.values(seleccionados).some((val) => val)) {
      return Swal.fire({
        title: "Error",
        icon: "error",
        text: "Seleccione al menos un producto.",
      });
    }
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      // Envío de la factura
      const facturaBody = {
        fecha: new Date().toISOString().split("T")[0],
        pedidos: productos
          .filter((p) => seleccionados[p.id])
          .map((p) => ({
            codigo_pedido: p.codigo,
            cantidad_facturada: p.cantidad,
            precio_unitario: p.precio,
          })),
      };

      const respFactura = await fetch(
        `${IP}/api/orden-compra/${codigoOrden}/factura`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(facturaBody),
        }
      );
      const resFactura = await respFactura.json();
      if (resFactura.AuthErr) return tokenError(resFactura.MENSAJE);
      if (resFactura.ERROR || resFactura.ServErr) {
        return Swal.fire({
          title: "Error",
          icon: "error",
          text: resFactura.MENSAJE,
        });
      }

      // Envío del asiento. Se construye el objeto usando los datos calculados
      const fechaAsiento = new Date().toISOString().split("T")[0];
      const horaAsiento = new Date().toTimeString().split(" ")[0].slice(0, 5);
      const asientoBody = {
        Descripcion: `Asiento correspondiente a la facturacion de la orden de compra: ${codigoOrden}.`,
        Fecha: fechaAsiento,
        Hora: horaAsiento,
        Registros: [
          {
            Cuenta: codigoMercaderias,
            Debe: parseFloat(totalFactura),
            Haber: 0,
          },
          {
            Cuenta: codigoDocumentos,
            Debe: parseFloat(totalFactura),
            Haber: 0,
          },
        ],
      };

      const respAsiento = await fetch(`${IP}/api/asientos/registrarasiento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(asientoBody),
      });
      const resAsiento = await respAsiento.json();
      if (resAsiento.AuthErr) return tokenError(resAsiento.MENSAJE);
      if (resAsiento.ERROR || resAsiento.ServErr) {
        return Swal.fire({
          title: "Error",
          icon: "error",
          text: resAsiento.MENSAJE,
        });
      }
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "La factura y el asiento se registraron exitosamente.",
      });
      // Puedes limpiar productos y selecciones si lo deseas
      setProductos([]);
      setSeleccionados({});
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Fallo al crear factura y/o asiento.",
      });
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#e6e2d5", borderRadius: 5 }}>
      <Box
        sx={{
          marginTop: 4,
          backgroundColor: "#ffeb3b",
          padding: 4,
          borderRadius: 5,
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
          Vista Previa del Asiento
        </Typography>
        <TextField
          label="Fecha"
          type="date"
          value={fecha}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
          disabled
        />
        <TextField
          label="Hora"
          type="time"
          value={hora}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
          disabled
        />
        <TextField
          label="Descripción"
          type="text"
          value={`Asiento correspondiente a la facturacion de la orden de compra: ${codigoOrden}.`}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
          disabled
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Cuenta</b></TableCell>
                <TableCell><b>Debe</b></TableCell>
                <TableCell><b>Haber</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{codigoMercaderias}</TableCell>
                <TableCell>{totalFactura}</TableCell>
                <TableCell>0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{codigoDocumentos}</TableCell>
                <TableCell>0</TableCell>
                <TableCell>{totalFactura}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Typography
        variant="h4"
        sx={{
          marginBottom: 2,
          color: "#333",
          fontWeight: "bold",
          textAlign: "center",
        }}
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
                  checked={
                    productos.length > 0 &&
                    productos.every((p) => seleccionados[p.id])
                  }
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
        disabled={!Object.values(seleccionados).some((v) => v)}
        onClick={handleConfirmar}
      >
        Confirmar Factura
      </Button>
    </Box>
  );
};

export default AltaFactura;
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
  Grid,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { Context } from "../../context/Context";
import { useLocation, useNavigate } from "react-router-dom";

const AltaFactura = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ordenSeleccionada = location.state?.orden;
  const [codigoOrden, setCodigoOrden] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});
  const { IP, tokenError, usuarioAutenticado, deslogear } = useContext(Context);

  // --- ASIENTO CONTABLE STATES ---
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const formattedTime = today.toTimeString().split(" ")[0].slice(0, 5);
  const [fecha, setFecha] = useState(formattedDate);
  const [hora, setHora] = useState(formattedTime);
  const [numeroFactura, setNumeroFactura] = useState("");
  const [descripcion, setDescripcion] = useState(`Asiento correspondiente a la Orden de Compra: ${codigoOrden} - CUIT Proveedor: ${proveedor} - NRO_FACTURA: ${numeroFactura}`);
  const [filas, setFilas] = useState([
    { cuenta: "", debe: "", haber: "" },
    { cuenta: "", debe: "", haber: "" },
  ]);
  const [cuentasHojas, setCuentasHojas] = useState([]);
  const [fechaUltimoAsiento, setFechaUltimoAsiento] = useState("");
  const [horaUltimoAsiento, setHoraUltimoAsiento] = useState("");
  const [error, setError] = useState("");

  const [habilitarFactura, setHabilitarFactura] = useState(true)
  const [habilitarAsiento, setHabilitarAsiento] = useState(false)


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
            precio: p.precio_unitario || "",
          }))
        );
      } catch (err) {
        console.error(err);
        Swal.fire({ title: "Error", icon: "error", text: "Hubo un problema al conectar con el servidor." });
      }
    };

    const fetchCuentas = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const res = await fetch(`${IP}/api/cuentas/obtenerhojas`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.AuthErr) tokenError(data.MENSAJE);
        else if (data.ServErr || data.ERROR) Swal.fire("Error", data.MENSAJE, "error");
        else setCuentasHojas(data.Hojas);
      } catch (err) {
        Swal.fire("Error", "No se pudo cargar las cuentas contables.", "error");
      }
    };

    if (ordenSeleccionada?.codigo) {
      fetchPedidos(ordenSeleccionada.codigo);
      fetchCuentas();
    }
  }, [IP, tokenError, ordenSeleccionada]);

  useEffect(() => {
    const total = productos
      .filter((p) => seleccionados[p.id])
      .reduce((acc, p) => acc + (parseFloat(p.precio || 0) * parseInt(p.cantidad || 0)), 0);

    setFilas((prev) => {
      const nuevas = [...prev];
      nuevas[0] = {
        ...nuevas[0],
        debe: total.toFixed(2),
        haber: "0",
      };

      // Si aún no tiene cuenta y existe una cuenta llamada 'Mercaderías', la asignamos
      if (!nuevas[0].cuenta) {
        const cuentaMercaderias = cuentasHojas.find((c) =>
          c.nombre.toLowerCase().includes("mercader")
        );
        if (cuentaMercaderias) {
          nuevas[0].cuenta = cuentaMercaderias.codigo;
        }
      }

      return nuevas;
    });
  }, [productos, seleccionados, cuentasHojas]);


  const toggleSeleccion = (id) => {
    setSeleccionados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSeleccionTodos = () => {
    const todosSeleccionados = Object.values(seleccionados).every(Boolean);
    const nuevoEstado = {};
    productos.forEach((p) => { nuevoEstado[p.id] = !todosSeleccionados });
    setSeleccionados(nuevoEstado);
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, cantidad: Math.max(1, parseInt(cantidad) || 1) } : p)));
  };

  const actualizarPrecio = (id, precio) => {
    const precioValido = /^\d+(\.\d{1,2})?$/.test(precio) ? precio : "";
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, precio: precioValido } : p)));
  };

  const handleFilaChange = (index, event) => {
    const { name, value } = event.target;
    const nuevasFilas = [...filas];
    if (name === "cuenta") nuevasFilas[index].cuenta = value;
    if (name === "debe") { nuevasFilas[index].debe = value; nuevasFilas[index].haber = "0"; }
    if (name === "haber") { nuevasFilas[index].haber = value; nuevasFilas[index].debe = "0"; }
    setFilas(nuevasFilas);
  };

  const agregarFila = () => setFilas([...filas, { cuenta: "", debe: "", haber: "" }]);

  const eliminarFila = (index) => {
    if (filas.length > 2) setFilas(filas.filter((_, i) => i !== index));
    else setError("No se puede eliminar más filas, el mínimo es 2.");
  };

  const handleConfirmar = async (event) => {
    event.preventDefault()
    const token = JSON.parse(localStorage.getItem("accessToken"));
    const body = {
      fecha: new Date().toISOString().split("T")[0],
      nro_comprobante: numeroFactura,
      pedidos: productos
        .filter((p) => seleccionados[p.id])
        .map((p) => ({
          codigo_pedido: p.codigo,
          cantidad_facturada: p.cantidad,
          precio_unitario: p.precio,
        })),
    };

    try {
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
      if (res.ERROR || res.ServErr){
        return Swal.fire("Error", res.MENSAJE, "error");
      }
      Swal.fire("Éxito", "La factura se registró exitosamente.", "success");
      /* setProductos([]);
      setSeleccionados({}); */
      //Hasta aqui ALTA ASIENTO deberia estar en ONLY READ y el boton de confirmar asiento en DISABLED
      //Aca se deberia pasar todo lo de alta factura a ONLYREAD y habilitar la edicion de ALTA ASIENTO
      setHabilitarFactura(false)
      setHabilitarAsiento(true)
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Fallo al crear la factura.", "error");
    }
  };

  // Calcular la sumatoria de las columnas "Debe" y "Haber"
  const calcularSumatorias = () => {
    const totalDebe = filas.reduce(
      (sum, fila) => sum + parseFloat(fila.debe || 0),
      0
    );
    const totalHaber = filas.reduce(
      (sum, fila) => sum + parseFloat(fila.haber || 0),
      0
    );
    return { totalDebe, totalHaber };
  };

  // Función para manejar el envío al backend
  const crearAsiento = async (event) => {
    event.preventDefault();
    setError(null); // Limpiar cualquier error previo

    const { totalDebe, totalHaber } = calcularSumatorias();

    // Verificar que el debe y el haber estén balanceados
    if (totalDebe !== totalHaber) {
      setError(
        `La sumatoria del Debe (${totalDebe}) debe ser igual a la del Haber (${totalHaber}).`
      );
      return;
    }

    if ((totalDebe == 0) & (totalHaber == 0)) {
      setError(`No se puede registrar un asiento con valores nulos.`);
      return;
    }

    // Preparar el objeto para enviar al backend
    const data = {
      Descripcion: descripcion,
      Fecha: fecha,
      Hora: hora,
      Registros: filas.map((fila) => ({
        Cuenta: fila.cuenta,
        Debe: parseFloat(fila.debe),
        Haber: parseFloat(fila.haber),
      })),
    };

    // Aquí podrías descomentar la lógica de envío al servidor
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const response = await fetch(`${IP}/api/asientos/registrarasiento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.AuthErr) {
        tokenError(result.MENSAJE);
      } else if (result.ServErr) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: result.MENSAJE,
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
      } else if (result.ERROR) {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: result.MENSAJE,
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setHabilitarAsiento(false)
        Swal.fire({
          icon: "success",
          title: "Exito",
          text: result.MENSAJE,
          color: "#fff",
          background: "#333",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo enviar la información al servidor",
        icon: "error",
        color: "#fff",
        background: "#333",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#e6e2d5", borderRadius: 5 }}>
      <Typography variant="h4" sx={{ my: 2, color: "#333", fontWeight: "bold", textAlign: "center" }}>
        Alta de Factura
      </Typography>

      {/* Datos de la orden */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
        <Typography variant="h6">Orden: {codigoOrden || "N/A"}</Typography>
        <Typography variant="h6">Proveedor: {proveedor || "N/A"}</Typography>
      </Box>

      {/* Número de factura */}
      <TextField
        label="Número de Factura"
        value={numeroFactura}
        onChange={(e) => { setNumeroFactura(e.target.value); setDescripcion(`Asiento correspondiente a la Orden de Compra: ${codigoOrden} - CUIT Proveedor: ${proveedor} - NRO_FACTURA: ${e.target.value}`) }}
        fullWidth
                  InputProps={{ readOnly: !habilitarFactura }}
        sx={{ mb: 3 }}
      />

      {/* Tabla de productos */}
      <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffeb3b" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={productos.length > 0 && productos.every((p) => seleccionados[p.id])}
                  onChange={toggleSeleccionTodos}
                    disabled={!habilitarFactura}
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
                  <Checkbox
                    checked={!!seleccionados[producto.id]}
                    onChange={() => toggleSeleccion(producto.id)}
                    disabled={!habilitarFactura}
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
                    onChange={(e) => actualizarCantidad(producto.id, e.target.value)}
                  InputProps={{ readOnly: !habilitarFactura }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={producto.precio}
                    onChange={(e) => actualizarPrecio(producto.id, e.target.value)}
                  InputProps={{ readOnly: !habilitarFactura }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"sx={{ 
    mt: 3, 
    bgcolor: "#ffeb3b", 
    color: "black",
    display: !habilitarFactura ? "none" : "block" // 👈 Esto ocultará el botón correctamente
  }}
        disabled={!Object.values(seleccionados).some((v) => v)}
        onClick={handleConfirmar}
      >
        Confirmar Factura
      </Button>

      {/* FORMULARIO DE ASIENTO CONTABLE */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Registrar Asiento Contable</Typography>
        <TextField
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          inputProps={{ min: fechaUltimoAsiento ,readOnly: true}}
        />
        <TextField
          label="Hora"
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ readOnly: true }}
        />

        {filas.map((fila, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={5}>
              <FormControl fullWidth>
                <InputLabel>Cuenta</InputLabel>
                <Select
                  name="cuenta"
                  value={fila.cuenta}
                  onChange={(e) => handleFilaChange(index, e)}
                  disabled={!habilitarAsiento}
                >
                  {cuentasHojas.map((c) => (
                    <MenuItem key={c.codigo} value={c.codigo}>
                      {c.codigo} - {c.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="debe"
                label="Debe"
                value={fila.debe}
                onChange={(e) => handleFilaChange(index, e)}
                fullWidth
          InputProps={{ readOnly: !habilitarAsiento }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="haber"
                label="Haber"
                value={fila.haber}
                onChange={(e) => handleFilaChange(index, e)}
                fullWidth
          InputProps={{ readOnly: !habilitarAsiento }}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton color="error" onClick={() => eliminarFila(index)} 
                  disabled={!habilitarAsiento}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <IconButton onClick={() => setError("")}
                  disabled={!habilitarAsiento}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        <Button
          onClick={agregarFila}
          startIcon={<AddIcon />}
          variant="outlined"
          fullWidth
          sx={{ mb: 2,
    display: !habilitarAsiento ? "none" : "block" }}
          
                  disabled={!habilitarAsiento}
        >
          Agregar Fila
        </Button>

        <Button
          variant="contained"
          fullWidth
          sx={{ backgroundColor: "#3b3a31", color: "#ffff", marginTop: 2,
    display: !habilitarAsiento ? "none" : "block" }}
          onClick={crearAsiento}
                  disabled={!habilitarAsiento}
        >
          Crear Asiento
        </Button>
      </Box>
    </Box>
  );

};

export default AltaFactura;

