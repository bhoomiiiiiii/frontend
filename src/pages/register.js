import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Freelancer', // Default role
  });
  const [message, setMessage] = useState({ msg: '', isError: false });
  const navigate = useNavigate();

  const { username, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // MySQL backend register route
      const registerUrl = 'http://10.207.90.169:5002/api/auth/register';
      const newUser = { username, email, password, role };
      
      const res = await axios.post(registerUrl, newUser);
      
      setMessage({ msg: 'Registration Successful! Please login.', isError: false });
      
      // 2 second baad login page par bhej do
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage({ msg: (err.response && err.response.data.msg) ? err.response.data.msg : 'Registration Failed. Check server.', isError: true });
    }
  };

  return (
    // 'container' class from styles.css
    <div className="container" style={{ maxWidth: '450px' }}>
      {/* 'card' class from styles.css */}
      <div className="card">
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '700', margin: '0 0 1.5rem 0' }}>
          Create Account
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
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </div>
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
          <div className="form-group">
            <label>Register as</label>
            <select name="role" value={role} onChange={onChange}>
              <option value="Freelancer">Freelancer (I want to work)</option>
              <option value="Client">Client (I want to hire)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Register
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Already have an account? 
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none', marginLeft: '0.5rem' }}>
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
