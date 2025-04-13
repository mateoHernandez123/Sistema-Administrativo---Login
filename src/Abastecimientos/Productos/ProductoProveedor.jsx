import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, MenuItem, Select } from "@mui/material";
import Swal from "sweetalert2";
import { Context } from "../../context/Context";
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const ProductoProveedor = () => {
  const { codigo } = useParams(); // Código del producto desde la URL
  const navigate = useNavigate();
  const { IP, tokenError } = useContext(Context);

  const [proveedores, setProveedores] = useState([]); // Lista de todos los proveedores
  const [proveedoresAsignados, setProveedoresAsignados] = useState([]); // Proveedores que ya tiene el producto
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
  
        // Obtener todos los proveedores
        const responseTodos = await fetch(`${IP}/api/proveedores/listar/1?all=1&filtro=`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataTodos = await responseTodos.json();
  
        // Comprobamos que la respuesta contenga la lista de proveedores
        console.log("Proveedores obtenidos:", dataTodos.ListaProv);
        if (dataTodos.ListaProv) {
          setProveedores(dataTodos.ListaProv); // Guardamos todos los proveedores
        }
  
        // Obtener proveedores asignados al producto
        const responseAsignados = await fetch(`${IP}/api/productos/listarproveedoresdeproducto?codigo=${codigo}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataAsignados = await responseAsignados.json();
  
        // Verificamos la respuesta de proveedores asignados
        console.log("Proveedores asignados al producto:", dataAsignados.ArrayProveedores);
  
        if (Array.isArray(dataAsignados.ArrayProveedores)) {
          setProveedoresAsignados(dataAsignados.ArrayProveedores); // Guardamos los proveedores asignados
        }
      } catch (error) {
        console.log("Error al obtener los proveedores:", error);
        Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
      }
    };

    fetchProveedores();
  }, [IP, codigo]);

  const handleAsignarProveedor = async () => {
    if (!proveedorSeleccionado) {
      Swal.fire("Atención", "Selecciona un proveedor", "warning");
      return;
    }
  
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
  
      // Buscamos el CUIT del proveedor seleccionado
      const proveedor = proveedores.find(p => p.cuit === proveedorSeleccionado);
  
      if (!proveedor) {
        Swal.fire("Atención", "Proveedor no encontrado", "warning");
        return;
      }
      console.log("Código del producto:", codigo);
    console.log("CUIT del proveedor:", proveedor.cuit);
  
      const response = await fetch(`${IP}/api/productos/producto-proveedor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          CodigoProducto: codigo, 
          CuitProveedor: proveedor.cuit // Enviar solo el cuit del proveedor
        }),
      });
  
      const data = await response.json();
  
      if (data.ERROR) {
        Swal.fire("Error", data.MENSAJE, "error");
      } else {
        Swal.fire("Éxito", "Proveedor asignado correctamente", "success");
        setProveedoresAsignados([...proveedoresAsignados, proveedor]);
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo asignar el proveedor", "error");
    }
  };

  const handleEliminarProveedor = async (proveedor) => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
  
      // Confirmación antes de eliminar
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Deseas eliminar el proveedor ${proveedor.razon_social}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });
  
      if (!confirm.isConfirmed) return; // Si no confirma, no hace nada
  
      // Mostrar en consola los valores antes de enviarlos
      console.log("Código del producto:", codigo);
      console.log("CUIT del proveedor:", proveedor.cuit);
  
      // Hacer la solicitud DELETE
      const response = await fetch(`${IP}/api/productos/producto-proveedor`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          CodigoProducto: codigo, 
          CuitProveedor: proveedor.cuit, // Enviar solo el cuit del proveedor
        }),
      });
  
      const data = await response.json();
  
      if (data.ERROR) {
        Swal.fire("Error", data.MENSAJE, "error");
      } else {
        Swal.fire("Éxito", "Proveedor eliminado correctamente", "success");
  
        // Eliminar el proveedor de la lista local de proveedores asignados
        setProveedoresAsignados(proveedoresAsignados.filter(p => p.cuit !== proveedor.cuit));
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el proveedor", "error");
    }
  };
  

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 5 }}>
      <Typography variant="h4" sx={{ marginBottom: 3, textAlign: "center" }}>
        Asignar o Eliminar Proveedor al Producto
      </Typography>
  
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Código del Producto: {codigo}
      </Typography>
  
      {proveedoresAsignados.length === 0 ? (
        <Typography variant="body1" sx={{ marginBottom: 3, color: "gray", textAlign: "center" }}>
          ❌ Este producto no tiene proveedores asignados.
        </Typography>
      ) : (
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>Proveedores asignados:</Typography>
          {proveedoresAsignados.map((prov) => (
            <Box 
              key={prov.cuit} 
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}
            >
              <Typography variant="body1">{prov.razon_social} ({prov.cuit})</Typography>
              <IconButton
                onClick={() => handleEliminarProveedor(prov)}
                color="error" // Color rojo para eliminar
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
  
      <Select
        value={proveedorSeleccionado}
        onChange={(e) => setProveedorSeleccionado(e.target.value)}
        displayEmpty
        fullWidth
        sx={{ marginBottom: 3 }}
      >
        <MenuItem value="" disabled>Selecciona un proveedor</MenuItem>
        {proveedores.map((prov) => (
          <MenuItem 
            key={prov.cuit} 
            value={prov.cuit}
            disabled={proveedoresAsignados.some(p => p.cuit === prov.cuit)}
          >
            {prov.razon_social} ({prov.cuit}) {proveedoresAsignados.some(p => p.cuit === prov.cuit) ? "✅" : ""}
          </MenuItem>
        ))}
      </Select>
  
      <Button variant="contained" color="primary" onClick={handleAsignarProveedor}>
        Asignar Proveedor
      </Button>
    </Box>
  );
  
};

export default ProductoProveedor;
