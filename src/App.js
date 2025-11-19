import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* --- CORRECT, LOWERCASE IMPORTS --- */
// Yeh aapke file structure (screenshot) se match karta hai
import Navbar from './components/navbar'; 
import Dashboard from './pages/dashboard'; 
import Login from './pages/login'; 
import Register from './pages/register'; 
import PostProject from './pages/postproject'; 
import ProjectDetail from './pages/projectdetail'; 
// import MyProjects from './pages/myprojects'; // Ise abhi comment kar rahe hain

function App() {
  return (
    <Router>
      {/* Navbar (fixed rahega) */}
      <Navbar /> 
      
      {/* Main Content Area (Navbar ke neeche, achhi spacing ke saath) */}
      {/* 'main-container-padding' class from styles.css */}
      <main className="main-container-padding">
        <Routes>
          {/* Default route ko Login par bhejte hain */}
          <Route path="/" element={<Login />} /> 
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-project" element={<PostProject />} />
          {/* Sahi route path project/:id hai, jaisa screenshot mein hai */}
          <Route path="/project/:id" element={<ProjectDetail />} /> 
          {/* <Route path="/my-projects" element={<MyProjects />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
