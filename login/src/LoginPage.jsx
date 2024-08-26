// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './style.css'; // Asegúrate de que el archivo style.css esté en la misma carpeta o ajusta la ruta según corresponda
import Swal from 'sweetalert2'; //Libreria de alertas y popups personalizadas
const Toast = Swal.mixin({
  toast: false,
  position: "center",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
}); //seteo de la alerta que aparece en el login

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el envío del formulario

    // Ejemplo de validación de contraseña (puedes ajustar la lógica según tus necesidades)
    if (password.length < 6) {
      setError(true); // Muestra el mensaje de error
    } else {
      setError(false); // Oculta el mensaje de error
      Toast.fire({
        icon:'success',
        title:'Sesión iniciada',
        text: email
      }) //Disparo de la alerta
      // Aquí podrías manejar el envío del formulario, como hacer una petición a un servidor
    }
  };

  return (
    <div className="fondo">
      <form onSubmit={handleSubmit}>
        <h1>Sistema Contable</h1>

        <div className="input-box">
          <input
            type="email" //Tipo "email", no "text" para poder revisar si contiene "@"
            placeholder="Nombre de Usuario"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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

        <button type="submit" className="btn">Iniciar Sección</button>
      </form>
    </div>
  );
};

export default LoginPage;
