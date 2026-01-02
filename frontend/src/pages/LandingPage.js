import React from 'react';
import Navbar from '../Components/Navbar';
import Chatbot from '../Components/Chatbot';
import './css/LandingPage.css';
import { Link } from 'react-router-dom';
// import { FaUserAstronaut } from "react-icons/fa"; 

const LandingPage = () => {
  const subjects = [
    { id: 1, name: 'Mensuration', image: '/images/algebra1.jpg' },
    { id: 2, name: 'Algebra', image: '/images/algebra2.jpg' },
    { id: 3, name: 'Set', image: '/images/algebra3.jpeg' },
    { id: 4, name: 'Statistics and Probability', image: '/images/algebra4.jpeg' }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      
      
      <div className="landing-content">
        <div className="subjects-sidebar">
          {subjects.map((subject) => (
            <Link 
              key={subject.id} 
              to={`/quiz/${subject.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="subject-card-link"
            >
              <div className="subject-card">
                <img src={subject.image} alt={subject.name} />
                <h3>{subject.name}</h3>
              </div>
              {/* <FaUserAstronaut className="astronaut-icon" /> */}
            </Link>
          ))}
        </div>

        <div className="hero-section">
          <div className="masked-image">
            <img 
              src="/images/Pahad.jpeg" 
              alt="Failed to load" 
            />
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default LandingPage;
