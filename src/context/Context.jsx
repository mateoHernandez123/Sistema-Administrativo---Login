import { createContext, useEffect, useState } from "react";

export const Context = createContext();

const estadoUsuario = JSON.parse(localStorage.getItem("UsuarioAutenticado")) || false;

export const ContextProvider = ({ children }) => {
  
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(estadoUsuario);

  const logear = (user, token, permisos) => {
    localStorage.setItem("accessToken", JSON.stringify(token));
    localStorage.setItem("Usuario", JSON.stringify(user));
    localStorage.setItem('Permisos', JSON.stringify(permisos));
    setUsuarioAutenticado(true);
    return true;
  };

  const deslogear = () => {
    localStorage.clear();
    setUsuarioAutenticado(false);
  };

  const tokenError = (mensaje) => {
    /*Alerta.fire({
      icon:'warning',
      title: 'Atención!',
      text: mensaje+'. Debe volver a registrarse.'
    })*/ // Aca hay que definirle algun popup para mostrar que hubo un error
    deslogear();
  };

  useEffect(() => {
    localStorage.setItem(
      "UsuarioAutenticado",
      JSON.stringify(usuarioAutenticado)
    );
  }, [usuarioAutenticado]);


  return (
    <Context.Provider
      value={{ 
        usuarioAutenticado, 
        logear, 
        deslogear, 
        tokenError 
      }}
    >
      {children}
    </Context.Provider>
  );
};
