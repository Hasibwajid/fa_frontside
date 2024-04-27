// TransitionRoutes.jsx

import React from "react";
import { Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const TransitionRoutes = ({ children }) => {
  return (
    <Route
      render={({ location }) => (
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <Switch location={location}>{children}</Switch>
          </CSSTransition>
        </TransitionGroup>
      )}
    />
  );
};

export default TransitionRoutes;
