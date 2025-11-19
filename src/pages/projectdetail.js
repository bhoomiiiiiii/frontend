import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Token se User ID nikaalne ke liye

function ProjectDetail() {
  const { id } = useParams(); // URL se project ID
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // 'isAuthenticated' variable
  const isAuthenticated = token ? true : false; 
  
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [bidAmount, setBidAmount] = useState('');
  const [proposal, setProposal] = useState(''); // MySQL field: proposal_text
  const [bidStatusMsg, setBidStatusMsg] = useState({ msg: '', isError: false });

  // User state
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  // Authentication Config
  const config = {
    headers: { 'x-auth-token': token }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Token se User ID aur Role decode karein
    try {
      const decodedToken = jwtDecode(token); 
      setCurrentUserId(decodedToken.user.id);
      setCurrentUserRole(decodedToken.user.role);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem('token'); 
      navigate('/login');
    }

    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Project ki detail laao
        const projectUrl = `/api/projects/${id}`;
        const projectRes = await axios.get(projectUrl, config);
        setProject(projectRes.data);

        // 2. Uss project par lagi saari bids laao
        const bidsUrl = `/api/projects/${id}/bids`;
        const bidsRes = await axios.get(bidsUrl, config);
        setBids(bidsRes.data);

      } catch (err) {
        console.error("Error fetching project details:", err.response ? err.response.data : err.message);
        setError('Failed to fetch project details or bids. Please ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, navigate, token]);

  // Bid Submit Function
  const onBidSubmit = async (e) => {
    e.preventDefault();
    setBidStatusMsg({ msg: '', isError: false });

    try {
      const bidData = {
        project_id: id,
        bid_amount: parseFloat(bidAmount),
        proposal_text: proposal
      };

      const res = await axios.post('http://localhost:5002/api/bids', bidData, config);
      
      setBidStatusMsg({ msg: 'Bid placed successfully!', isError: false });
      setBids([...bids, res.data]); // Nayi bid ko list mein add karein
      setBidAmount('');
      setProposal('');

    } catch (err) {
      console.error(err.response ? err.response.data : "Unknown error");
      setBidStatusMsg({ msg: (err.response && err.response.data.msg) ? err.response.data.msg : 'Error placing bid.', isError: true });
    }
  };
      
  // Bid Accept Function
  const handleAcceptBid = async (bidId) => {
    if (!window.confirm('Are you sure you want to accept this bid? This will close the project for further bidding.')) {
      return;
    }
    
    try {
      const acceptUrl = `http://localhost:5002/api/bids/${bidId}/accept`;
      const res = await axios.put(acceptUrl, {}, config);
      
      alert(res.data.msg);
      window.location.reload(); // Page refresh karein
      
    } catch (err) {
      console.error(err.response ? err.response.data : "Unknown error");
      setBidStatusMsg({ msg: (err.response && err.response.data.msg) ? err.response.data.msg : 'Error accepting bid.', isError: true });
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--color-primary)' }}>Loading project details...</div>;
  }
  if (error) {
    return (
      <div className="container card" style={{ borderColor: '#ef4444' }}>
        <h3 style={{ color: '#f87171', fontSize: '1.25rem', fontWeight: '700' }}>Error</h3>
        <p>{error}</p>
      </div>
    );
  }
  if (!project) {
    return <div className="container" style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>Project not found.</div>;
  }
  
  // ✅ FIX: 'isOwner' check ko String() comparison se fix kiya
  // Isse Number (1) aur Text ("1") ka comparison hamesha sahi hoga
  const isOwner = String(currentUserId) === String(project.createdby_id);

  return (
    // 'container' class (ab styles.css se 'main-container-padding' mein hai)
    <div className="container"> 
      {/* Project ki Detail */}
      <div className="card">
        <div className="project-detail-header">
          <h2>{project.title}</h2>
          <span className="project-detail-budget">${project.budget}</span>
        </div>
        <p className="project-detail-desc">{project.description}</p>
        <p style={{ marginTop: '1rem', fontWeight: '600' }}>
          Status: <span className="status-tag">{project.status}</span>
        </p>
      </div>
      
      {/* Bid Form (Sirf Freelancer ko dikhega, agar project open hai) */}
      {isAuthenticated && currentUserRole === 'Freelancer' && project.status === 'open' && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 1.5rem 0' }}>Place Your Bid</h3>
          {bidStatusMsg.msg && (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: bidStatusMsg.isError ? 'rgba(220, 38, 38, 0.2)' : 'rgba(34, 197, 94, 0.2)',
              color: bidStatusMsg.isError ? '#f87171' : '#4ade80',
              border: `1px solid ${bidStatusMsg.isError ? 'rgba(220, 38, 38, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`
            }}>
              {bidStatusMsg.msg}
            </div>
          )}
          <form onSubmit={onBidSubmit}>
            <div className="form-group">
              <label>Your Bid Amount ($)</label>
              <input
                type="number"
                name="bidAmount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Your Proposal</label>
              <textarea
                name="proposal"
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                required
                rows="3"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Place Bid</button>
          </form>
        </div>
      )}
      
      {/* Agar project open nahi hai, toh message dikhayein */}
      {project.status !== 'open' && (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#facc15' }}>This project is no longer open for bidding.</p>
        </div>
      )}
      
      {/* Bids ka Section */}
      <div className="bids-section">
        <h3>Bids on this Project ({bids.length})</h3>
        {bids.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No bids placed yet.</p>
        ) : (
          <ul className="bids-list">
            {bids.map((bid) => (
              <li key={bid.id} className="bid-card">
                <div className="bid-card-header">
                  <strong className="bid-card-freelancer">{bid.freelancerName}</strong> 
                  <span className="bid-card-amount">${bid.bid_amount}</span>
                </div>
                <p className="bid-card-proposal">{bid.proposal_text}</p>
                <div className="bid-card-footer">
                  <span className="bid-status">Status: {bid.status}</span>
                  
                  {/* YEH HAI BUTTON KA LOGIC */}
                  {/* 1. Kya user owner hai? (isOwner) */}
                  {/* 2. Kya project 'open' hai? */}
                  {isOwner && project.status === 'open' && (
                    <button 
                      className="btn btn-accept"
                      onClick={() => handleAcceptBid(bid.id)}
                    >
                      Accept Bid
                    </button>
                  )}
                  
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;