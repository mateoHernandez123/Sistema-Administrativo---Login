// script.js
document.querySelector('form').addEventListener('submit', function(event) {
  var password = document.getElementById('password').value;
  var errorMessage = document.getElementById('password-error');
  
  // Ejemplo de validación de contraseña (puedes ajustar la lógica según tus necesidades)
  if (password.length < 6) {
      event.preventDefault(); // Evita el envío del formulario
      errorMessage.style.display = 'block'; // Muestra el mensaje de error
  } else {
      errorMessage.style.display = 'none'; // Oculta el mensaje de error
  }
});
