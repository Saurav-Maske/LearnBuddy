import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Chatbot from '../Components/Chatbot';
import './css/QuizPage.css';

const QuizPage = () => {
  const { subject } = useParams();
  
  // Convert URL parameter back to readable format
  const subjectName = subject
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="quiz-page">
      <Navbar />
      
      <div className="quiz-content">
        <div className="quiz-header">
          <h1>{subjectName} Quiz</h1>
          <p>Test your knowledge in {subjectName}</p>
        </div>

        <div className="quiz-container">
          <div className="quiz-info">
            <p>Welcome to the {subjectName} quiz section!</p>
            <p>Quiz content will be implemented here.</p>
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default QuizPage;
