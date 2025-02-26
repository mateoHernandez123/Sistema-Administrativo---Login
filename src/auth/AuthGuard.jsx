import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";

const AuthGuard = ({ children }) => {
  const { usuarioAutenticado, deslogear } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioEnLocalStorage = JSON.parse(
      localStorage.getItem("UsuarioAutenticado")
    );

    if (!usuarioEnLocalStorage) {
      deslogear();
      navigate("/login", { replace: true });
    }
  }, [usuarioAutenticado, navigate, deslogear]);

  return usuarioAutenticado ? children : null;
};

export default AuthGuard;
