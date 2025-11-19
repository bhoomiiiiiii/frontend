import React from 'react';
import ReactDOM from 'react-dom/client';
// Sahi CSS file ko import karna (Aapke screenshot ke hisaab se)
import './styles.css'; 
import App from './App';
import { jwtDecode } from 'jwt-decode'; // jwt-decode ko import karein

// Token decode function (Helper)
const setTokenAndUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      // User ID aur Role ko localStorage mein save karein taaki components use kar sakein
      localStorage.setItem('userId', decoded.user.id);
      localStorage.setItem('userRole', decoded.user.role);
    } catch (error) {
      console.error("Invalid token:", error);
      // Agar token kharaab hai, toh use clear kar dein
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userId');
    }
  }
};

// App start hone se pehle token check karein
setTokenAndUser();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
