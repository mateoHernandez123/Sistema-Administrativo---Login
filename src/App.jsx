import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import FormularioCuenta from "./FormularioCuenta";
import FormularioAsiento from "./FormularioAsiento";
import ListaMayores from "./ListaMayores";
import ListaResultados from "./ListaResultados";
import ListaUsuarios from "./ListaUsuarios";
import Home from "./Home";
import LoginPage from "./LoginPage";
import ListaLibroDiario from "./ListaLibroDiario";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta específica para el login, sin AppLayout */}
        <Route path="/login" element={<LoginPage />} />
        {/* Rutas protegidas o con layout */}
        <Route
          path="/*"
          element={
            <AppLayout>
              <Routes>
                <Route path="/cuentas" element={<FormularioCuenta />} />
                <Route path="/asientos" element={<FormularioAsiento />} />
                <Route path="/diarios" element={<ListaLibroDiario />} />
                <Route path="/mayores" element={<ListaMayores />} />
                <Route path="/resultados" element={<ListaResultados />} />
                <Route path="/usuarios" element={<ListaUsuarios />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
