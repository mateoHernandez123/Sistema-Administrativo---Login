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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import Swal from "sweetalert2";

const GeneradorPresupuestos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [seleccionarTodos, setSeleccionarTodos] = useState(false);
  const navigate = useNavigate();

  const { IP, tokenError } = useContext(Context);

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const response = await fetch(`${IP}/api/pedidos-compra/`, {
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
          const pedidosConID = data.pedidos.map((pedido, index) => ({
            ...pedido,
            id: pedido.id ?? `${pedido.codigopedido || "P"}-${index}`,
          }));
          setPedidos(pedidosConID);
          console.log(pedidosConID);
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

  const handleListar = () => {
    navigate("/listar-presupuesto");
  };

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSeleccionarTodos = () => {
    if (seleccionarTodos) {
      setSeleccionados([]);
    } else {
      setSeleccionados(pedidos.map((p) => p.id));
    }
    setSeleccionarTodos(!seleccionarTodos);
  };

  const generarPresupuestos = async () => {
    const pedidosSeleccionados = pedidos.filter((p) =>
      seleccionados.includes(p.id)
    );

    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const response = await fetch(
        `${IP}/api/presupuestos/v2/generar-pre-presupuestos`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            arrayCodigos: pedidosSeleccionados.map((p) => p.codigopedido),
          }),
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
        Swal.fire({
          title: "Presupuestos generados",
          text: "Se generaron correctamente los presupuestos.",
          icon: "success",
        });
        navigate("/presupuestos", {
          state: { presupuestos: data.presupuestos },
        });
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
        Listado de Pedidos
      </Typography>
      <Box display="flex" justifyContent="right" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            onClick={handleListar}
            sx={{
              backgroundColor: "#ffeb3b",
              color: "black",
              marginRight: 5,
              borderRadius: "1.2rem",
            }}
          >
            Listado de Presupuestos
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffeb3b" }}>
              <TableCell sx={{ textAlign: "center" }}>
                <Checkbox
                  checked={seleccionarTodos}
                  onChange={toggleSeleccionarTodos}
                />
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <b>Código</b>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <b>Nombre</b>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <b>Marca</b>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <b>Modelo</b>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <b>Descripción</b>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <b>Cantidad</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id} sx={{ backgroundColor: "#e0e0e0" }}>
                <TableCell sx={{ textAlign: "center" }}>
                  <Checkbox
                    checked={seleccionados.includes(pedido.id)}
                    onChange={() => toggleSeleccion(pedido.id)}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {pedido.codigopedido}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {pedido.nombre}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {pedido.marca}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {pedido.modelo}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {pedido.descripcion}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {pedido.cantidad}
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
        onClick={generarPresupuestos}
        disabled={seleccionados.length === 0}
      >
        Generar Presupuestos
      </Button>
    </Box>
  );
};

export default GeneradorPresupuestos;
