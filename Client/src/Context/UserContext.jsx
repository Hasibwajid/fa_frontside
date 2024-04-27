// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check if the user is logged in by verifying the authentication token in localStorage
    const authToken = localStorage.getItem('authToken');
    const storedUserRole = localStorage.getItem('userRole');

    if (authToken && storedUserRole) {
      // User is logged in
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
    } else {
      // User is not logged in
      setIsLoggedIn(false);
      setUserRole('');
    }
  }, []);

  // Function to handle the login event and update the context values
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserRole(localStorage.getItem('userRole'));
  };

  // Function to handle the logout event and update the context values
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, userRole, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
