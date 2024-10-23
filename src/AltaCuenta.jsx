import { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Context } from "./context/Context";
import Swal from "sweetalert2";

const FormularioCuenta = () => {
  const [cuentas, setCuentas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    grupo: "", // Ahora se llena dinámicamente
    descripcion: "",
  });
  const [errors, setErrors] = useState({
    codigo: false,
    monto: false,
  });
  const [grupos, setGrupos] = useState([]); // Opciones de grupos dinámicas
  const [loadingGrupos, setLoadingGrupos] = useState(false); // Para manejar el estado de carga
  const [cuentasRaices, setCuentasRaices] = useState([]);
  // Función para manejar los cambios en el campo "Tipo"
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === "codigo") {
      const isNumeric = /^\d*$/.test(value); // Validación de solo números enteros
      setErrors({ ...errors, codigo: !isNumeric });
    }

    if (name === "monto") {
      const isValidMonto = /^\d+(\.\d{0,2})?$/.test(value); // Validación de hasta 2 decimales
      setErrors({ ...errors, monto: !isValidMonto });
    }

    setFormData({ ...formData, [name]: value });

    // Si se selecciona el "Tipo", hacer la petición al backend para obtener los grupos
    if (name === "tipo") {
      setLoadingGrupos(true);
      try {
        const response = await fetch(
          `https://api.ejemplo.com/grupos?tipo=${value}`
        ); // Cambia la URL por la de tu backend
        const data = await response.json();
        setGrupos(data.grupos); // Asume que el backend devuelve un objeto con un array llamado "grupos"
      } catch (error) {
        console.error("Error al cargar los grupos:", error);
      } finally {
        setLoadingGrupos(false);
      }
    }
  };

  /*El que estaba, por si necesitamos agregar alguna validacion, que no esta:
 const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !errors.codigo &&
      !errors.monto &&
      formData.codigo !== "" &&
      formData.monto !== ""
    ) {
      setCuentas([...cuentas, formData]);
      setFormData({
        codigo: "",
        nombre: "",
        descripcion: "",
        monto: "",
        tipo: "",
        habilitada: true,
      });
    }
  };
*/

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const { usuarioAutenticado, deslogear, IP, tokenError } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    const verificarUsuario = async () => {
      if (!JSON.parse(localStorage.getItem("UsuarioAutenticado"))) {
        deslogear();
        navigate("/login", { replace: true });
      } else {
        try {
          const token = JSON.parse(localStorage.getItem("accessToken"));
          let resultado = await fetch(`${IP}/api/cuentas/obtenerraices`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, //Esto hay que hacerlo con todos, filtra las entradas
            },
          });
          resultado = await resultado.json(); // Aquí estaba `.JSON()`, debe ser `.json()`

          if (resultado.AuhtErr) {
            tokenError(resultado.MENSAJE);
          } else if (resultado.ServErr) {
            Toast.fire({
              title: "Error",
              icon: "error",
              text: resultado.MENSAJE,
            });
          } else {
            if (resultado.ERROR) {
              Toast.fire({
                icon: "warning",
                title: "Atención",
                text: resultado.MENSAJE,
              });
            }
            setCuentasRaices(resultado.Raices);
          }
        } catch (err) {
          console.log(err);
          Toast.fire({
            title: "Error en la carga de datos. Recargar la pagina",
            icon: "warning",
          });
        }
      }
    };

    verificarUsuario(); // Llama a la función asíncrona
  }, [usuarioAutenticado, deslogear, navigate, IP, Swal]); // Asegúrate de agregar todas las dependencias necesarias

  const listarHijos = async (nombre) => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      let resultado = await fetch(`${IP}/api/cuentas/obtenerhijos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, //Esto hay que hacerlo con todos, filtra las entradas
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: nombre,
        }),
      });
      resultado = await resultado.json(); // Aquí estaba `.JSON()`, debe ser `.json()`

      if (resultado.AuhtErr) {
        tokenError(resultado.MENSAJE);
      } else if (resultado.ServErr) {
        Toast.fire({
          title: "Error",
          icon: "error",
          text: resultado.MENSAJE,
        });
      } else {
        if (resultado.ERROR) {
          Toast.fire({
            icon: "warning",
            title: "Atención",
            text: resultado.MENSAJE,
          });
        }
        //Me trae un array de objetos
        //console.log(resultado.Raices);
        //setCuentasRaices(resultado.Raices);
      }
    } catch (err) {
      console.log(err);
      Toast.fire({
        title: "Error en la carga de datos. Recargar la pagina",
        icon: "warning",
      });
    }
  };

  const agregarCuenta = async (
    Nombre,
    Tipo,
    recibe_saldo,
    Descripcion,
    Padre
  ) => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      let resultado = await fetch(`${IP}/api/cuentas/abmcuentas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, //Esto hay que hacerlo con todos, filtra las entradas
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nodo: {
            nombre: Nombre,
            tipo: Tipo,
            recibeSaldo: recibe_saldo,
            descripcion: Descripcion,
            padre: Padre,
          },
        }),
      });
      resultado = await resultado.json(); // Aquí estaba `.JSON()`, debe ser `.json()`

      if (resultado.AuhtErr) {
        tokenError(resultado.MENSAJE);
      } else if (resultado.ServErr) {
        Toast.fire({
          title: "Error",
          icon: "error",
          text: resultado.MENSAJE,
        });
      } else {
        if (resultado.ERROR) {
          Toast.fire({
            icon: "warning",
            title: "Atención",
            text: resultado.MENSAJE,
          });
        }
        //Me trae un objeto cuenta
        console.log(resultado.Cuenta);
      }
    } catch (err) {
      console.log(err);
      Toast.fire({
        title: "Error en la carga de datos. Recargar la pagina",
        icon: "warning",
      });
    }
  };

  const desactivarCuenta = async (
    Nombre
  ) => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      let resultado = await fetch(`${IP}/api/cuentas/abmcuentas`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, //Esto hay que hacerlo con todos, filtra las entradas
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: Nombre,
        }),
      });
      resultado = await resultado.json(); // Aquí estaba `.JSON()`, debe ser `.json()`

      if (resultado.AuhtErr) {
        tokenError(resultado.MENSAJE);
      } else if (resultado.ServErr) {
        Toast.fire({
          title: "Error",
          icon: "error",
          text: resultado.MENSAJE,
        });
      } else {
        if (resultado.ERROR) {
          Toast.fire({
            icon: "warning",
            title: "Atención",
            text: resultado.MENSAJE,
          });
        }
        //Me trae un objeto cuenta
        console.log(resultado.Cuenta);
      }
    } catch (err) {
      console.log(err);
      Toast.fire({
        title: "Error en la carga de datos. Recargar la pagina",
        icon: "warning",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nombre !== "" && formData.tipo !== "") {
      // Lógica de envío de datos
      setFormData({
        nombre: "",
        tipo: "",
        grupo: "",
        descripcion: "",
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffeb3b",
        color: "black",
        padding: 4,
        borderRadius: 2,
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Alta de Cuenta Contable
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
          required
        />

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Tipo</InputLabel>
          <Select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="Activo">Activo</MenuItem>
            <MenuItem value="Pasivo">Pasivo</MenuItem>
            <MenuItem value="Patrimonio Neto">Patrimonio Neto</MenuItem>
            <MenuItem value="Resultado Positivo">Resultado Positivo</MenuItem>
            <MenuItem value="Resultado Negativo">Resultado Negativo</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Grupo</InputLabel>
          <Select
            name="grupo"
            value={formData.grupo}
            onChange={handleInputChange}
            required
            disabled={loadingGrupos || !formData.tipo} // Deshabilita mientras carga o si no hay tipo seleccionado
          >
            {loadingGrupos ? (
              <MenuItem>Cargando grupos...</MenuItem>
            ) : (
              grupos.map((grupo) => (
                <MenuItem key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <TextField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ backgroundColor: "#3b3a31", color: "white", marginTop: 2 }}
        >
          Agregar Cuenta
        </Button>
      </form>

      <Typography variant="h5" sx={{ marginTop: 4 }}>
        Cuentas Agregadas:
      </Typography>
      {cuentas.length > 0 ? (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {cuentas.map((cuenta, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  backgroundColor: "#3b3a31",
                  color: "#fff",
                  border: "2px solid #ffeb3b",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
                    {cuenta.nombre}
                  </Typography>
                  <Typography variant="body1">Tipo: {cuenta.tipo}</Typography>
                  <Typography variant="body1">Grupo: {cuenta.grupo}</Typography>
                  <Typography variant="body1">
                    Descripción: {cuenta.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No hay cuentas agregadas.</Typography>
      )}
    </Box>
  );
};

export default FormularioCuenta;
