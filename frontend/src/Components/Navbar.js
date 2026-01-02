import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Get user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
       <Link to={user ? "/dashboard" : "/"}>
        <h1>LearnBuddy </h1>
       </Link>
      </div>
      <div className="navbar-menu">
        <Link to="/student-signup" className="nav-link">Sign up</Link>
        <Link to="/student-login" className="nav-link">Login</Link>
        <div className="profile-container" ref={dropdownRef}>
          <div className="profile-icon" onClick={toggleDropdown}>
            <img src="/images/placehholder.jpeg" alt="Profile" />
          </div>
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                <span className="dropdown-label">Name:</span>
                <span className="dropdown-value">{user?.name || 'Guest'}</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-label">Email:</span>
                <span className="dropdown-value">{user?.email || 'Not logged in'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
