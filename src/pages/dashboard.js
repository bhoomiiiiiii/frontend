import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); 

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      setError(null); 
      try {
        const config = {
          headers: { 'x-auth-token': token }
        };
        // MySQL backend route: /api/projects
        const res = await axios.get('/api/projects', config);
        setProjects(res.data);
      } catch (err) {
        console.error('Project fetching failed:', err.response ? err.response.data : err.message);
        
        let errorMsg = 'Failed to fetch projects. Please try again.';
        if (err.response && err.response.data && err.response.data.msg) {
            errorMsg = err.response.data.msg; 
        }
        setError(errorMsg);

      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate, token]);

  // --- ✅ CHANGE 1: AJAX Loader (Spinner) added here ---
  if (loading) {
    return (
      <div className="container main-container-padding">
        <div className="ajax-loader-container">
           <span className="loader"></span>
        </div>
        <p style={{textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '1rem'}}>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      // --- ✅ CHANGE 2: Added 'main-container-padding' to fix layout issues ---
      <div className="container main-container-padding">
        <div className="card" style={{ borderColor: '#ef4444', textAlign: 'center' }}>
          <h3 style={{ color: '#f87171', fontSize: '1.25rem', fontWeight: '700' }}>Error</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()} style={{marginTop: '1rem'}}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    // --- ✅ CHANGE 3: Added 'main-container-padding' here too ---
    <div className="container main-container-padding">
      
      <div className="dashboard-header">
        <h2>Open Projects</h2>
        {/* Sirf 'Client' hi project post kar sakta hai */}
        {userRole === 'Client' && (
          <Link to="/post-project" className="btn btn-primary">
            Post New Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>No projects are currently open for bidding.</p>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map(project => (
            <Link to={`/project/${project.id}`} key={project.id} className="project-card-link">
              {/* Card structure same as before, keeping your design intact */}
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="project-card-content">
                    <div>
                      <div className="project-card-header">
                        <h3 className="project-card-title">
                          {project.title}
                        </h3>
                        <span className="status-tag">
                          {project.status}
                        </span>
                      </div>
                      <p className="project-card-desc">
                        {project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}
                      </p>
                    </div>
                    <div className="project-card-footer">
                      <div className="budget">
                        <span style={{ color: 'var(--color-text-muted)' }}>Budget:</span>
                        <span className="budget-amount">${parseFloat(project.budget).toFixed(2)}</span>
                      </div>
                      <div className="budget" style={{ marginTop: '0.5rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Posted by:</span>
                        <span style={{ color: 'var(--color-primary)' }}>{project.ownerName || 'Client'}</span>
                      </div>
                    </div>
                  </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;