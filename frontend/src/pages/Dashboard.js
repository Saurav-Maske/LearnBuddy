import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Chatbot from '../Components/Chatbot';
import './css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/student-login');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/student-login');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="dashboard-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}!</h1>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>


          

        

        <div className="dashboard-sections">
          <div className="section">
            <h2>Your Subjects</h2>
            <div className="subjects-grid">
              <div className="subject-item">
                <span className="subject-icon"></span>
                <span>Mensuration</span>
              </div>
              <div className="subject-item">
                <span className="subject-icon"></span>
                <span>Algebra</span>
              </div>
              <div className="subject-item">
                <span className="subject-icon"></span>
                <span>Set Theory</span>
              </div>
              <div className="subject-item">
                <span className="subject-icon"></span>
                <span>Statistics</span>
              </div>
            </div>
          </div>

         
          
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default Dashboard;
