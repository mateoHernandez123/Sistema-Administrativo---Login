import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import FormularioCuenta from './FormularioCuenta';
import FormularioAsiento from './FormularioAsiento'; // Crear este componente
import ListaMayores from './ListaMayores'; // Crear este componente
import ListaResultados from './ListaResultados'; // Crear este componente
import ListaUsuarios from './ListaUsuarios'; // Crear este componente
import Home from './Home';

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/cuentas" element={<FormularioCuenta />} />
          <Route path="/asientos" element={<FormularioAsiento />} />
          <Route path="/mayores" element={<ListaMayores />} />
          <Route path="/resultados" element={<ListaResultados />} />
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
