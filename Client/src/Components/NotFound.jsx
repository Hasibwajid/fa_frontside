import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">Oops!</h1>
      <p className="not-found-text">The page you're looking for could not be found.</p>
      <p className="not-found-text">Please check the URL or go back to the <Link to="/">homepage</Link>.</p>
    </div>
  );
};

export default NotFound;
