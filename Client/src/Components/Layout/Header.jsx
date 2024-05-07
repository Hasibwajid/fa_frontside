import React, { useContext, useState, useEffect, useRef } from 'react';
import { FaBars, FaSignOutAlt, FaCog } from 'react-icons/fa';
import './Header.css';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa'; // Import the FontAwesome icon
import { confirmAlert } from 'react-confirm-alert';

const Header = () => {
  const history = useHistory();
  const { isLoggedIn, userRole, handleLogout } = useContext(UserContext); // Use the UserContext to get the login status and user role
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handlePostJobClick = (event) => {
    event.preventDefault();

  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleLoginClick = (e) => {
    e.preventDefault();
    history.push('/Login');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to handle the "Log Out" click
  const handleLogoutClick = (e) => {

    localStorage.removeItem('authToken');
    localStorage.removeItem('clientId');
    localStorage.removeItem('userRole')
    localStorage.removeItem('clientName')
    setIsDropdownOpen(false)
    handleLogout();

    history.push('/Login');
  };

  
  const handleLogoutConfirm = () => {
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleLogoutClick(),
        },
        {
          label: "No",
          onClick: () => {setIsDropdownOpen(false)},
        },
      ],
    });
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <Link to="/">
{/*             <img src="/path/to/logo.png" alt="Your Logo" /> */}
            <h3>Freylancer</h3>
          </Link>
        </div>
        <nav className="header-nav">
          <ul className="nav-links">
            {isLoggedIn && userRole === 'client' ? (
              <>
                <li>
                  <Link to="/Freelancers">Find Freelancers</Link>
                </li>
                <li>
                  <Link to="/jobsPage">My Jobs</Link>
                </li>
                <li>
                  <Link to="/Contracts">My Contracts</Link>
                </li>
                <li>
                  <Link to="/messages">Messages</Link>
                </li>
              </>
            ) : isLoggedIn && userRole === 'freelancer' ? (
              <>
                <li>
                  <Link to="/freelancerProposals">My Proposals</Link>
                </li>
                <li>
                  <Link to="/messages">Messages</Link>
                </li>
                <li>
                  <Link to="/freelancerHome">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/SignUp">Find Freelancers</Link>
                </li>
                <li>
                  <Link to="/freelancerHome">Find Jobs</Link>
                </li>
                <li>
                  <Link to="/HowItWorks">How It Works</Link>
                </li>
                <li>
                  <Link to="/">Enterprise</Link>
                </li>
              </>
            )}
          </ul>
          <div className="header-actions">
            {isLoggedIn && userRole === 'client' && (
              <Link to="/postJob" className="header-post-job" >
                Post a Job
              </Link>
            )}
            {!isLoggedIn && (
              <Link to="/Login" className="header-post-job" >
                Post a Job
              </Link>
            )}
            {isLoggedIn ? (
              <div className="profile-wrapper">
                <div className="profile-image" onClick={() => setIsDropdownOpen(!isDropdownOpen)}></div>
                {isDropdownOpen && (
                  <ul className="dropdown-list">
                    <li className="user-role">
                    <FaUser className="role-icon" />
                      {userRole}</li>

                    <li onClick={handleLogoutConfirm}>
                      <FaSignOutAlt className="dropdown-icon" />
                      Log Out
                    </li>
                    <li>
                      <FaCog className="dropdown-icon" />
                      Settings
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link to="/Login" className="header-login" onClick={handleLoginClick}>
                Log In
              </Link>
            )}
            <button className="header-menu-btn">
              <FaBars />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
