import React, { useState } from 'react';
import { TextField, Button, FormControl, Select, MenuItem, InputLabel, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';

const FormularioCuenta = () => {
  const [cuentas, setCuentas] = useState([]);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    monto: '',
    tipo: '',
    habilitada: true
  });

  const [errors, setErrors] = useState({
    codigo: false,
    monto: false
  });

  const handleInputChange = (e) => {
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
  };

  const handleCheckboxChange = () => {
    setFormData({ ...formData, habilitada: !formData.habilitada });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!errors.codigo && !errors.monto && formData.codigo !== '' && formData.monto !== '') {
      setCuentas([...cuentas, formData]);
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        monto: '',
        tipo: '',
        habilitada: true
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffeb3b',
        color: 'black',
        padding: 4,
        borderRadius: 2,
        maxWidth: '600px',
        margin: 'auto'
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Alta de Cuenta Contable
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Código"
          name="codigo"
          value={formData.codigo}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
          required
          error={errors.codigo}
          helperText={errors.codigo ? "Debe ser un número válido" : ""}
        />
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
          required
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Monto"
          name="monto"
          value={formData.monto}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: 2 }}
          required
          error={errors.monto}
          helperText={errors.monto ? "Debe ser un número decimal válido con hasta 2 decimales" : ""}
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

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.habilitada}
              onChange={handleCheckboxChange}
              color="primary"
            />
          }
          label={formData.habilitada ? 'Habilitada' : 'Deshabilitada'}
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ backgroundColor: 'black', color: 'yellow', marginTop: 2 }}
          disabled={errors.codigo || errors.monto}
        >
          Agregar Cuenta
        </Button>
      </form>

      <Typography variant="h5" sx={{ marginTop: 4 }}>
        Cuentas Agregadas:
      </Typography>
      {cuentas.length > 0 ? (
        <ul>
          {cuentas.map((cuenta, index) => (
            <li key={index}>
              {cuenta.codigo} - {cuenta.nombre} - {cuenta.tipo} - {cuenta.monto} -{' '}
              {cuenta.habilitada ? 'Habilitada' : 'Deshabilitada'}
            </li>
          ))}
        </ul>
      ) : (
        <Typography>No hay cuentas agregadas.</Typography>
      )}
    </Box>
  );
};

export default FormularioCuenta;
