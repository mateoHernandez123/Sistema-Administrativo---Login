import { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { Context } from "../../context/Context";
import { format } from "date-fns";
const FormularioOrdenCompra = () => {
  // const today = new Date().toISOString().split("T")[0];
  // const [numeroOrden, setNumeroOrden] = useState("OC-2024-001");
  // const [fechaOrden, setFechaOrden] = useState(today);
  const [proveedor, setProveedor] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [presupuestos, setPresupuestos] = useState([]);
  const [cuit, setCuit] = useState("");
  const [noPedidos, setNoPedidos] = useState([]); // Pedidos eliminados
  // const [direccionProveedor, setDireccionProveedor] = useState("");
  // const [telefonoProveedor, setTelefonoProveedor] = useState("");
  // const [correoProveedor, setCorreoProveedor] = useState("");
  // const [solicitante, setSolicitante] = useState("");
  // const [departamento, setDepartamento] = useState("");
  const [productos, setProductos] = useState([
    { producto: "", descripcion: "", cantidad: 0, precio: 0, total: 0 },
  ]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  const [formaPago, setFormaPago] = useState("");
  const [plazoPago, setPlazoPago] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [lugarEntrega, setLugarEntrega] = useState("");
  const [observacion, setObservacion] = useState("");
  const [usarEnvio, setUsarEnvio] = useState(false);
  const mañana = format(
    new Date(Date.now() + 24 * 60 * 60 * 1000),
    "yyyy-MM-dd"
  );
  const { IP, tokenError } = useContext(Context);

  // const agregarProducto = () => {
  //   setProductos([
  //     ...productos,
  //     { producto: "", descripcion: "", cantidad: 0, precio: 0, total: 0 },
  //   ]);
  // };

  const handlePresupuestoChange = async (e) => {
    const codigo = e.target.value;
    setPresupuesto(codigo);

    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const response = await fetch(
        `${IP}/api/presupuestos/v2/listar/${codigo}`,
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
        setProveedor(data.razon_proveedor);
        setCuit(data.cuit_proveedor);
        const productosFormateados = data.productos.map((prod) => ({
          codigo: prod.codigo,
          codigo_pedido: prod.codigo_pedido,
          producto: prod.nombre,
          descripcion: `${prod.marca} - ${prod.modelo}`,
          cantidad: prod.cantidad_pedido,
          precio: 0,
          total: 0,
        }));

        setProductos(productosFormateados);
        console.log("DATA:", data);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No se pudo cargar el presupuesto.",
        color: "#fff",
        background: "#333",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const formatearFechaYHora = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
    const opcionesHora = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Argentina/Buenos_Aires",
    };

    const fechaFormateada = fecha.toLocaleDateString("es-AR", opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString("es-AR", opcionesHora);

    return { fechaFormateada, horaFormateada };
  };

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const response = await fetch(`${IP}/api/presupuestos/v2/listar`, {
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
          setPresupuestos(
            data.presupuestos.map((p) => {
              const { fechaFormateada, horaFormateada } = formatearFechaYHora(
                p.fecha_presupuesto
              );
              return {
                ...p,
                fecha: fechaFormateada,
                hora: horaFormateada,
              };
            })
          );
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
    fetchPresupuestos();
  }, [IP, tokenError]);

  const eliminarProducto = (index) => {
    if (productos.length > 1) {
      const productoEliminado = productos[index];
      const nuevosProductos = productos.filter((_, i) => i !== index);
      setProductos(nuevosProductos);
      setNoPedidos([...noPedidos, productoEliminado]);
    } else {
      Swal.fire(
        "Error",
        "Debe haber al menos un producto en la lista.",
        "error"
      );
    }
  };
  // console.log(productos);

  const resetForm = () => {
    setProveedor("");
    setPresupuesto("");
    setCuit("");
    setNoPedidos([]);
    setProductos([
      { producto: "", descripcion: "", cantidad: 0, precio: 0, total: 0 },
    ]);
    setSubtotal(0);
    setIva(0);
    setTotal(0);
    setFormaPago("");
    setPlazoPago("");
    setFechaEntrega("");
    setLugarEntrega("");
    setObservacion("");
    setUsarEnvio(false);
  };
  const generarOrdenCompra = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));

      const pedidosSi = productos.map((p) => ({
        codigo: p.codigo_pedido,
        cantidad: Number(p.cantidad),
        precioUnitario: Number(p.precio),
      }));

      const pedidosNo = noPedidos.map((p) => ({
        codigo: p.codigo_pedido,
      }));

      const orden = {
        subtotal,
        iva,
        total,
        formaPago,
        plazoPago,
        envio: usarEnvio ? usarEnvio : false,
        fechaEntrega: usarEnvio ? fechaEntrega : null,
        lugarEntrega: usarEnvio ? lugarEntrega : null,
        observaciones: observacion,
      };

      const body = {
        orden,
        presupuesto,
        pedidosSi,
        pedidosNo,
      };
      console.log(body);
      const response = await fetch(`${IP}/api/orden-compra/alta`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
        Swal.fire({
          icon: "success",
          title: "Orden de Compra Creada",
          text: "La orden de compra se ha generado correctamente.",
        });
        resetForm();
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

  const restaurarProducto = (index) => {
    const productoRestaurado = noPedidos[index];
    setProductos([...productos, productoRestaurado]);
    const nuevosNoPedidos = noPedidos.filter((_, i) => i !== index);
    setNoPedidos(nuevosNoPedidos);
  };

  const handleProductoChange = (index, name, value) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][name] = value;
    if (name === "cantidad" || name === "precio") {
      nuevosProductos[index].total =
        nuevosProductos[index].cantidad * nuevosProductos[index].precio;
    }
    setProductos(nuevosProductos);

    // Recalcular el total
    const updatedSubtotal = nuevosProductos.reduce(
      (acc, producto) => acc + producto.total,
      0
    );
    const updatedIva = updatedSubtotal * 0.21;
    setSubtotal(updatedSubtotal);
    setIva(updatedIva);
    setTotal(updatedSubtotal + updatedIva);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffeb3b",
        color: "#3b3a31",
        padding: 4,
        borderRadius: 5,
        width: "900px",
        maxWidth: "100%",
        margin: "auto",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
        Orden de Compra
      </Typography>

      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Presupuesto
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Presupuestos Disponibles</InputLabel>
            <Select
              value={presupuesto}
              onChange={handlePresupuestoChange}
              required
            >
              {presupuestos.map((presupuesto, index) => (
                <MenuItem key={index} value={presupuesto.codigo_presupuesto}>
                  {presupuesto.codigo_presupuesto} -{" "}
                  {presupuesto.razon_proveedor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Información del proveedor */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Información del Proveedor
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Razon Social</Typography>
          <FormControl fullWidth>
            <TextField
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              fullWidth
              disabled
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Cuit</Typography>
          <TextField
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
            fullWidth
            disabled
          />
        </Grid>
      </Grid>

      {/* Detalle del pedido */}
      <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
        Detalle del Pedido
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "#ffeb3b", marginBottom: 4, borderRadius: 5 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Producto</TableCell>
              <TableCell align="center">Descripción</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="center">Precio Unitario</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto, index) => (
              <TableRow key={index}>
                <TableCell>{producto.producto}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleProductoChange(
                        index,
                        "cantidad",
                        Math.max(1, parseInt(e.target.value, 10) || 1)
                      )
                    }
                    inputProps={{ min: 1 }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={producto.precio}
                    onChange={(e) =>
                      handleProductoChange(
                        index,
                        "precio",
                        Math.max(1, parseFloat(e.target.value) || 1)
                      )
                    }
                    inputProps={{ min: 1 }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>{producto.total}</TableCell>
                <TableCell>
                  <IconButton onClick={() => eliminarProducto(index)}>
                    <DeleteIcon sx={{ color: "red" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Listados de pedidos cancelados */}
      {noPedidos.length > 0 && (
        <>
          <Typography variant="h5" sx={{ marginTop: 3 }}>
            Pedidos Cancelados
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#f44336",
              marginTop: 3,
              borderRadius: 5,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Producto</TableCell>
                  <TableCell align="center">Descripción</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {noPedidos.map((producto, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{producto.producto}</TableCell>
                    <TableCell align="center">{producto.descripcion}</TableCell>
                    <TableCell align="center">{producto.cantidad}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        // color="success"
                        onClick={() => restaurarProducto(index)}
                      >
                        <AddIcon sx={{ color: "green" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={agregarProducto}
          fullWidth
          sx={{
            color: "#3b3a31",
            borderColor: "#3b3a31",
            marginBottom: 2,
            marginTop: 2,
          }}
        >
          <AddIcon /> Agregar Producto
        </Button>
      </Box> */}

      {/* Resumen de la Orden */}
      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField label="Subtotal" value={subtotal} fullWidth readOnly />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="IVA (21%)" value={iva} fullWidth readOnly />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Total" value={total} fullWidth readOnly />
        </Grid>
      </Grid>

      {/* Forma de Pago de la Orden */}
      <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
        Forma de Pago de la Orden
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Forma de Pago"
            value={formaPago}
            onChange={(e) => setFormaPago(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Plazo de Pago"
            value={plazoPago}
            onChange={(e) => setPlazoPago(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Envio de la Orden */}
      <Typography variant="h5" sx={{ marginTop: 3 }}>
        Envío (Opcional)
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={usarEnvio}
            onChange={(e) => setUsarEnvio(e.target.checked)}
          />
        }
        label="¿Incluir información de envío?"
      />

      {usarEnvio && (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {/* <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Método de Envío"
              value={envio}
              onChange={(e) => setEnvio(e.target.value)}
            />
          </Grid> */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Fecha de Entrega"
              InputLabelProps={{ shrink: true }}
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              inputProps={{ min: mañana }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Lugar de Entrega"
              value={lugarEntrega}
              onChange={(e) => setLugarEntrega(e.target.value)}
            />
          </Grid>
        </Grid>
      )}
      {/* Observaciones */}
      <Typography
        variant="h5"
        sx={{
          color: "#333",
          fontSize: "1.6rem",
          marginTop: 2,
          marginBottom: 2,
          borderBottom: "2px solid #000",
          paddingBottom: 1,
        }}
      >
        Observaciones
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
      />

      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Button
          variant="contained"
          color="success"
          onClick={generarOrdenCompra}
          fullWidth
          sx={{ backgroundColor: "#3b3a31", color: "#ffff", marginTop: 2 }}
        >
          Generar Orden de Compra
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioOrdenCompra;
