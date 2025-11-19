import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // <-- Ise import karna zaroori hai

function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsUrl = '/api/projects';
        const res = await axios.get(projectsUrl);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []); 

  return (
    <div className="container">
      <h2>Open Projects</h2>
      <div className="project-list">
        {projects.length === 0 ? (
          <p>No projects found. (Make sure backend is running)</p>
        ) : (
          // --- Yahaan Badlaav Hua Hai ---
          projects.map((project) => (

            // Humne poore card ko ek clickable 'Link' bana diya hai
            <Link to={`/project/${project.id}`} key={project.id} className="project-card-link">
              <div className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <h4>Budget: ${project.budget}</h4>
              </div>
            </Link>

          ))
        )}
      </div>
    </div>
  );
}

export default Home;