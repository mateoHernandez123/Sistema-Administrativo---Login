import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './LoginPage';
import './style.css'; 


const App = () => {
  return (
    <div>
      <LoginPage />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
