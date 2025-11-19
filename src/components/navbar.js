import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  // State for handling login status
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  // Effect to update Navbar when login/logout happens
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      setUserRole(localStorage.getItem('userRole'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); 

  const handleLogout = () => {
    localStorage.clear(); // Clear all data
    setToken(null);
    setUserRole(null);
    navigate('/login');
  };

  return (
    // ✅ 'navbar' class styles.css se connect hogi (Mobile responsive)
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* === 1. Left Side: Logo === */}
        <Link to={token ? "/dashboard" : "/login"} className="navbar-title">
          Proof-of-Work Portal
        </Link>

        {/* === 2. Right Side: Menu Links === */}
        <div className="navbar-links">
          {token ? (
            // --- Agar User Login Hai ---
            <>
              <Link to="/dashboard">Dashboard</Link>
              
              {userRole === 'Client' && (
                <Link to="/post-project">Post Project</Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="btn btn-primary" // Use standard button class
                style={{ backgroundColor: '#ef4444', padding: '0.5rem 1rem', fontSize: '0.9rem' }} 
              >
                Logout
              </button>
            </>
          ) : (
            // --- Agar User Logout Hai ---
            <>
              <Link to="/login">Login</Link>
              
              {/* Register Button Style */}
              <Link 
                to="/register" 
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;