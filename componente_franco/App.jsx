import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContextProvider } from "../context/Context.jsx";
import AppLayout from "./AppLayout";
import AltaCuenta from "../Contable/Cuentas/AltaCuenta";
import FormularioCuenta from "../Contable/Cuentas/FormularioCuenta";
import FormularioAsiento from "../Contable/Asientos/FormularioAsiento";
import ListaMayores from "../Contable/Mayor/ListaMayores";
import ListaResultados from "../Contable/Resultado/ListaResultados";
import ListaUsuarios from "../Usuario/ListaUsuarios";
import Home from "../Home/Home";
import LoginPage from "../Login/LoginPage";
import ListaLibroDiario from "../Contable/Diario/ListaLibroDiario";
import EditarCuenta from "../Contable/Cuentas/EditarCuenta";
import MayorCuenta from "../Contable/Mayor/MayorCuenta.jsx";
import AltaProveedor from "../Abastecimientos/Proveedor/AltaProveedor.jsx";
import AltaProducto from "../Abastecimientos/Productos/AltaProducto.jsx";
import FormularioOrdenCompra from "../Abastecimientos/OrdenDeCompra/FormularioOrdenCompra.jsx";
import FiltrarProductos from "../Abastecimientos/Productos/FiltrarProductos.jsx";
import FiltrarProveedor from "../Abastecimientos/Proveedor/FiltrarProveedor.jsx";
import EditarProveedor from "../Abastecimientos/Proveedor/EditarProveedor.jsx";
import EditarProducto from "../Abastecimientos/Productos/EditarProducto.jsx";
import GeneradorPresupuestos from "../Abastecimientos/Presupuesto/GeneradorPresupuestos.jsx";
import PresupuestoDetalle from "../Abastecimientos/Presupuesto/PresupuestoDetalle.jsx";
import VisualizarProducto from "../Abastecimientos/Productos/VisualizarProducto.jsx";
import FiltrarSolicitudCompra from "../Abastecimientos/SolicitudDeCompra/FiltrarSolicitudCompra.jsx";
import AltaSolicitudCompra from "../Abastecimientos/SolicitudDeCompra/FormularioSolicitudCompra.jsx";
import DetalleSolicitud from "../Abastecimientos/SolicitudDeCompra/DetalleSolicitud.jsx";
import AuthGuard from "../auth/AuthGuard.jsx";
import OCRemito from "../Abastecimientos/Remito/OrdenesCompraList.jsx";
import AltaRemito from "../Abastecimientos/Remito/AltaRemito.jsx";
import OCFacturas from "../Abastecimientos/Facturas/OrdenesCompraList.jsx";
import AltaFactura from"../Abastecimientos/Facturas/AltaFactura.jsx";
import Venta from "../Abastecimientos/Ventas/Venta.jsx";

const App = () => {
  return (
    <ContextProvider>
      <Router>
        <Routes>
          {/* Ruta específica para el login, sin AppLayout */}
          <Route path="/login" element={<LoginPage />} />
          {/* Rutas protegidas o con layout */}
          <Route
            path="/*"
            element={
              <AuthGuard>
                {" "}
                {/* Verifica que el usuario este Autenticado */}
                <AppLayout>
                  <Routes>
                    <Route path="/cuentas" element={<FormularioCuenta />} />
                    <Route path="/alta-cuentas" element={<AltaCuenta />} />
                    <Route path="/asientos" element={<FormularioAsiento />} />
                    <Route path="/diarios" element={<ListaLibroDiario />} />
                    <Route path="/mayores" element={<MayorCuenta />} />
                    <Route path="/resultados" element={<ListaResultados />} />
                    <Route path="/usuarios" element={<ListaUsuarios />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/editar-cuenta" element={<EditarCuenta />} />
                    <Route path="/alta-proveedor" element={<AltaProveedor />} />
                    <Route path="/alta-producto" element={<AltaProducto />} />
                    <Route
                      path="/alta-solicitud-compra"
                      element={<AltaSolicitudCompra />}
                    />
                    <Route
                      path="/solicitud-compra"
                      element={<FiltrarSolicitudCompra />}
                    />
                    <Route
                      path="/orden-compra"
                      element={<FormularioOrdenCompra />}
                    />
                    <Route path="/productos" element={<FiltrarProductos />} />
                    <Route path="/proveedores" element={<FiltrarProveedor />} />
                    <Route
                      path="/editar-proveedor/:cuit"
                      element={<EditarProveedor />}
                    />
                    <Route
                      path="/editar-producto/:codigo"
                      element={<EditarProducto />}
                    />
                    <Route
                      path="/detalle-solicitud/:id"
                      element={<DetalleSolicitud />}
                    />
                    <Route
                      path="/presupuesto/"
                      element={<GeneradorPresupuestos />}
                    />
                    <Route
                      path="/presupuestos"
                      element={<PresupuestoDetalle />}
                    />
                    <Route
                      path="/visualizar-producto/:codigo"
                      element={<VisualizarProducto />}
                    />
                    <Route path="/remitos" element={<OCRemito />} />
                    <Route path="/alta-remito" element={<AltaRemito />} />
                    <Route path="/facturas" element={<OCFacturas />} />
                    <Route path="/alta-factura" element={<AltaFactura />} />
                    <Route path="/venta" element={<Venta />} />

                  </Routes>
                </AppLayout>
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
    </ContextProvider>
  );
};

export default App;
