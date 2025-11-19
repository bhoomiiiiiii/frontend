import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // jwt-decode ko import karein

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState({ msg: '', isError: false });
  const navigate = useNavigate();

  // Check agar user pehle se logged in hai
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard'); // Agar logged in hai, toh dashboard bhej do
    }
  }, [navigate]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // MySQL backend login route
      const loginUrl = '/api/auth/login';
      const user = { email, password };
      const res = await axios.post(loginUrl, user);
      
      // Token ko save karna
      const token = res.data.token;
      localStorage.setItem('token', token);
      
      // Token se User ID aur Role nikaal kar save karna
      try {
        const decoded = jwtDecode(token);
        localStorage.setItem('userId', decoded.user.id);
        localStorage.setItem('userRole', decoded.user.role);
      } catch (error) {
        console.error("Invalid token:", error);
      }
      
      setMessage({ msg: 'Login Successful! Redirecting...', isError: false });
      
      // Dashboard par bhej do
      // window.location.reload() taaki Navbar state update ho jaaye
      navigate('/dashboard');
      window.location.reload();
      
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage({ msg: (err.response && err.response.data.msg) ? err.response.data.msg : 'Login Failed. Check server.', isError: true });
    }
  };

  return (
    // 'container' class from styles.css
    <div className="container" style={{ maxWidth: '450px' }}>
      {/* 'card' class from styles.css */}
      <div className="card">
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '700', margin: '0 0 1.5rem 0' }}>
          Portal Login
        </h2>
        
        {message.msg && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: message.isError ? 'rgba(220, 38, 38, 0.2)' : 'rgba(34, 197, 94, 0.2)',
            color: message.isError ? '#f87171' : '#4ade80',
            border: `1px solid ${message.isError ? 'rgba(220, 38, 38, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`
          }}>
            {message.msg}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          {/* 'form-group' class from styles.css */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              minLength="6"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Don't have an account? 
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none', marginLeft: '0.5rem' }}>
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
