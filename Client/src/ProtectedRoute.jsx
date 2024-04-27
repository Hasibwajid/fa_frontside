// ProtectedRoute.js
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from './Context/UserContext';

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { isLoggedIn, userRole } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLoggedIn || !allowedRoles.includes(userRole)) {

          return isLoggedIn && userRole === 'freelancer' ? <Redirect to="/freelancerHome" /> : isLoggedIn && userRole === 'client' ? <Redirect to = "/jobsPage" /> : <Redirect to = "/Login" /> ;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
