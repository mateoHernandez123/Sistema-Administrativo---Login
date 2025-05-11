import { useContext, useState } from "react";
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
  Modal,
  IconButton,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PresupuestoDetalle = () => {
  const location = useLocation();
  const presupuestosRaw = location.state?.presupuestos || [];
  const presupuestos = presupuestosRaw.reduce((acc, item) => {
    const proveedor =
      item.proveedor?.razon_proveedor || "Proveedor desconocido";
    acc[proveedor] = item.pedidos || [];
    return acc;
  }, {});

  const [seleccionados, setSeleccionados] = useState({});
  const [cantidades, setCantidades] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const { IP, tokenError } = useContext(Context);

  const getProductoId = (producto) => producto.codigo_producto || producto.id;

  const toggleSeleccion = (proveedor, producto) => {
    const id = getProductoId(producto);
    setSeleccionados((prev) => {
      const nuevos = { ...prev };
      if (!nuevos[proveedor]) nuevos[proveedor] = [];

      const index = nuevos[proveedor].findIndex((p) => getProductoId(p) === id);
      if (index !== -1) {
        nuevos[proveedor].splice(index, 1);
      } else {
        nuevos[proveedor].push({
          ...producto,
          cantidad: cantidades[id] || producto.cantidad_pedido || 1,
        });
      }
      return nuevos;
    });
  };

  const toggleSeleccionProveedor = (proveedor, productos) => {
    const productosArray = Array.isArray(productos) ? productos : [];
    const todosSeleccionados =
      seleccionados[proveedor]?.length === productosArray.length;

    setSeleccionados((prev) => {
      const nuevos = { ...prev };
      nuevos[proveedor] = todosSeleccionados
        ? []
        : productosArray.map((p) => ({
            ...p,
            cantidad: cantidades[getProductoId(p)] || p.cantidad_pedido || 1,
          }));
      return nuevos;
    });
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    setCantidades((prev) => ({ ...prev, [productoId]: nuevaCantidad }));
    setSeleccionados((prev) => {
      const nuevos = { ...prev };
      Object.keys(nuevos).forEach((proveedor) => {
        nuevos[proveedor] = nuevos[proveedor].map((p) =>
          getProductoId(p) === productoId
            ? { ...p, cantidad: nuevaCantidad }
            : p
        );
      });
      return nuevos;
    });
  };

  const handlePresupuesto = () => {
    navigate("/presupuesto");
  };

  const generarPDFs = () => {
    Object.entries(seleccionados).forEach(([proveedor, productos]) => {
      if (!productos.length) return;

      const doc = new jsPDF();
      const fecha = new Date().toLocaleDateString();
      const numeroPresupuesto = Math.floor(1000 + Math.random() * 9000);

      doc.setFontSize(16);
      doc.text("Presupuesto de Productos", 14, 20);
      doc.setFontSize(12);
      doc.text(`Proveedor: ${proveedor}`, 14, 30);
      doc.text(`Fecha: ${fecha}`, 14, 40);
      doc.text(`Número de Presupuesto: ${numeroPresupuesto}`, 14, 50);

      autoTable(doc, {
        startY: 60,
        head: [["Código", "Nombre", "Marca", "Modelo", "Cantidad"]],
        body: productos.map((p) => [
          p.codigo_producto || p.codigo,
          p.nombre_producto || p.nombre,
          p.marca_producto || p.marca,
          p.modelo_producto || p.modelo,
          p.cantidad_pedido || p.cantidad,
        ]),
      });

      doc.save(`Presupuesto_${proveedor}.pdf`);
    });
    setModalOpen(false);
  };

  const generarPresupuestos = async () => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    const presupuestosBody = Object.entries(seleccionados)
      .map(([proveedor, productos]) => {
        if (!productos.length) return null;
        const presupuestoOriginal = presupuestosRaw.find(
          (p) => p.proveedor?.razon_proveedor === proveedor
        );
        const cuitProveedor =
          presupuestoOriginal?.proveedor?.cuit_proveedor || null;
        return {
          cuit_proveedor: cuitProveedor,
          pedidos: productos
            .filter((p) => p.codigo_pedido || p.codigo)
            .map((p) => ({
              codigo_pedido: p.codigo_pedido || p.codigo,
              cantidad_pedido: parseInt(p.cantidad),
            })),
        };
      })
      .filter(
        (p) =>
          p &&
          p.cuit_proveedor &&
          Array.isArray(p.pedidos) &&
          p.pedidos.length > 0
      );

    if (presupuestosBody.length === 0) {
      Swal.fire({
        title: "Error",
        text: "No se ha seleccionado ningún producto.",
        icon: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${IP}/api/presupuestos/v2/alta-presupuestos`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ presupuestos: presupuestosBody }), // Asegúrate de enviar como array
        }
      );
      console.log("Envio al back:", presupuestosBody);
      console.log(response.status);
      if (response.status === 200) {
        setModalOpen(true);

        Swal.fire({
          title: "Presupuestos finalizados",
          text: "Los presupuestos fueron creados correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          navigate("/listar-presupuesto");
        });
      } else {
        const data = await response.json();
        if (data.AuthErr) {
          tokenError(data.MENSAJE);
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text:
              data.MENSAJE || "Ocurrió un error al generar los presupuestos.",
            color: "#fff",
            background: "#333",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error en la conexión",
        icon: "error",
        text: "No se pudo conectar con el servidor.",
        color: "#fff",
        background: "#333",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#e6e2d5", borderRadius: 5 }}>
      <IconButton
        onClick={handlePresupuesto}
        sx={{
          backgroundColor: "#ffeb3b",
          "&:hover": { backgroundColor: "#fdd835" },
          color: "#333",
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography
        variant="h4"
        sx={{
          marginBottom: 4,
          color: "#333",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Detalles de Presupuesto
      </Typography>

      {Object.entries(presupuestos).map(([proveedor, productos]) => {
        const productosArray = Array.isArray(productos) ? productos : [];
        const todosSeleccionados =
          seleccionados[proveedor]?.length === productosArray.length;
        console.log(presupuestos);
        console.log(productosArray);
        return (
          <TableContainer
            component={Paper}
            key={proveedor}
            sx={{ marginBottom: 3, borderRadius: 5 }}
          >
            <Typography
              variant="h6"
              sx={{
                backgroundColor: "#ffeb3b",
                padding: 2,
                borderRadius: "5px 5px 0 0",
                fontWeight: "bold",
              }}
            >
              {proveedor}
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#ffeb3b" }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={todosSeleccionados || false}
                      onChange={() =>
                        toggleSeleccionProveedor(proveedor, productosArray)
                      }
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
                    <b>Cantidad</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productosArray.map((producto) => {
                  const id = getProductoId(producto);
                  return (
                    <TableRow key={id} sx={{ backgroundColor: "#e0e0e0" }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            seleccionados[proveedor]?.some(
                              (p) => getProductoId(p) === id
                            ) || false
                          }
                          onChange={() => toggleSeleccion(proveedor, producto)}
                        />
                      </TableCell>
                      <TableCell>
                        {producto.codigo_producto || producto.codigo}
                      </TableCell>
                      <TableCell>
                        {producto.nombre_producto || producto.nombre}
                      </TableCell>
                      <TableCell>
                        {producto.marca_producto || producto.marca}
                      </TableCell>
                      <TableCell>
                        {producto.modelo_producto || producto.modelo}
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={
                            cantidades[id] || producto.cantidad_pedido || 1
                          }
                          onChange={(e) =>
                            actualizarCantidad(id, e.target.value)
                          }
                          inputProps={{ min: 1 }}
                          size="small"
                          sx={{ width: "80px" }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        );
      })}

      <Button
        variant="contained"
        sx={{ marginTop: 3, backgroundColor: "#ffeb3b", color: "black" }}
        onClick={generarPresupuestos}
        disabled={Object.keys(seleccionados).every(
          (p) => seleccionados[p].length === 0
        )}
      >
        Confirmar
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: "white",
            margin: "auto",
            marginTop: 10,
            width: "50%",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Confirmar Presupuesto</Typography>
          {Object.entries(seleccionados).map(([proveedor, productos]) => (
            <Box key={proveedor} sx={{ marginTop: 2 }}>
              <Typography variant="h6">{proveedor}</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((p) => (
                    <TableRow key={getProductoId(p)}>
                      <TableCell>{p.codigo_producto || p.codigo}</TableCell>
                      <TableCell>{p.nombre_producto || p.nombre}</TableCell>
                      <TableCell>{p.cantidad_producto || p.cantidad}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ))}
          <Button
            variant="contained"
            sx={{ marginTop: 2, backgroundColor: "#4caf50", color: "white" }}
            onClick={generarPDFs}
          >
            Generar PDF
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default PresupuestoDetalle;
