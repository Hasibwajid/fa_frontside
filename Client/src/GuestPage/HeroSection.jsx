// Hero.js

import React from 'react';
import './Hero.css'
import {useHistory} from 'react-router-dom'

const Hero = () => {
  const history = useHistory();
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Find Your Perfect Freelancer</h1>
          <p>
            Hire top freelancers from around the world for any job, big or small.
            Whatever your needs, we have the right talent for you.
          </p>
          <button className="find-now-btn" onClick={() => history.push('/')}>Find Now</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
