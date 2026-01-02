import React from 'react';
import './css/Chatbot.css';

const Chatbot = () => {
  const handleChatClick = () => {
    // Add chatbot functionality here
    console.log('Chatbot clicked');
  };

  return (
    <div className="chatbot-container" onClick={handleChatClick}>
      <div className="chatbot-icon">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.98 3.04 16.26L2 22L7.74 20.96C9.02 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
            fill="white"
          />
          <path
            d="M9 11C9.55228 11 10 10.5523 10 10C10 9.44772 9.55228 9 9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44772 11 9 11Z"
            fill="#2b2b2b"
          />
          <path
            d="M15 11C15.5523 11 16 10.5523 16 10C16 9.44772 15.5523 9 15 9C14.4477 9 14 9.44772 14 10C14 10.5523 14.4477 11 15 11Z"
            fill="#2b2b2b"
          />
          <path
            d="M12 16C13.66 16 15.11 15.09 15.83 13.67L14.5 13C14 14 13.07 14.67 12 14.67C10.93 14.67 10 14 9.5 13L8.17 13.67C8.89 15.09 10.34 16 12 16Z"
            fill="#2b2b2b"
          />
        </svg>
      </div>
    </div>
  );
};

export default Chatbot;
