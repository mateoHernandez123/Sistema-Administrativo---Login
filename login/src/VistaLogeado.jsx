import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function VistaLogeado() {

  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  if (!usuarioAutenticado) {
    return <Navigate to="/login" />;
  }

  useEffect(()=>{
    let auth = localStorage.getItem('usuarioAutenticado') || false;
    setUsuarioAutenticado(auth);
  },[])

  return (
    <>
      <Outlet />
    </>
  );
}