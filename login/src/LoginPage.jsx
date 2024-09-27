// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./style.css"; // Asegúrate de que el archivo style.css esté en la misma carpeta o ajusta la ruta según corresponda

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault(); // Evita el envío del formulario

    // Ejemplo de validación de contraseña (puedes ajustar la lógica según tus necesidades)
    if (password.length < 6) {
      setError(true); // Muestra el mensaje de error
    } else {
      setError(false); // Oculta el mensaje de error
      // Aquí podrías manejar el envío del formulario, como hacer una petición a un servidor
    }
  };

  return (
    <div className="fondo">
      <form onSubmit={handleSubmit}>
        <h1>Sistema Contable</h1>

        <div className="input-box">
          <input type="text" placeholder="Nombre de Usuario" required />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box">
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="bx bxs-lock-alt"></i>
        </div>

        {error && (
          <div id="password-error" className="error-message">
            La contraseña es inválida
          </div>
        )}

        <button type="submit" className="btn">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
