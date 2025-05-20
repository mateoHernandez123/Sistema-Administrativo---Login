import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const categorias = [
  "Accesorios",
  "Baterías",
  "Botas",
  "Cascos",
  "Cubiertas",
  "Electronica",
  "Embrague",
  "Escape",
  "Escape Deportivo",
  "Filtros de aire",
  "Frenos",
  "Guantes",
  "Iluminación",
  "Indumentaria",
  "Lubricantes",
  "Protección",
  "Seguridad",
  "Suspensión",
  "Transmisión",
];

const SelectCategoria = ({ value, onChange }) => (
  <FormControl fullWidth>
    <InputLabel>Categoría</InputLabel>
    <Select name="categoria" value={value} onChange={onChange}>
      {categorias.map((cat, i) => (
        <MenuItem key={i} value={cat}>
          {cat}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SelectCategoria;
