import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostProject() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const [message, setMessage] = useState({ msg: '', isError: false });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Security Check: Agar user Client nahi hai, toh use dashboard bhej do
  useEffect(() => {
    if (!token || userRole !== 'Client') {
      navigate('/dashboard');
    }
  }, [navigate, token, userRole]);

  const { title, description, budget } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      
      const postProjectUrl = '/api/projects';
      const newProject = { title, description, budget: parseFloat(budget) };
      
      const res = await axios.post(postProjectUrl, newProject, config);
      
      setMessage({ msg: 'Project Posted Successfully! Redirecting...', isError: false });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error("Project post failed:", err.response ? err.response.data : err.message);
      
      // --- ✅ NEW ERROR HANDLING ---
      // Ab backend se aaya hua error message dikhega
      let errorMsg = 'Failed to post project. Please try again.';
      if (err.response && err.response.data) {
        // Check if data.msg exists (backend's custom error)
        if (err.response.data.msg) {
          errorMsg = err.response.data.msg;
        } 
        // Check if data.errors (validation array) exists
        else if (err.response.data.errors && err.response.data.errors.length > 0) {
          errorMsg = err.response.data.errors[0].msg; // Show first validation error
        }
      }
      setMessage({ msg: errorMsg, isError: true });
      // --- END NEW ERROR HANDLING ---
    }
  };

  return (
    // 'container' class from styles.css
    <div className="container" style={{ maxWidth: '700px' }}>
      {/* 'card' class from styles.css */}
      <div className="card">
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '700', margin: '0 0 1.5rem 0' }}>
          Post a New Project
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
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Project Description</label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              rows="5"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Budget ($)</label>
            <input
              type="number"
              name="budget"
              value={budget}
              onChange={onChange}
              min="1"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Post Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostProject;
