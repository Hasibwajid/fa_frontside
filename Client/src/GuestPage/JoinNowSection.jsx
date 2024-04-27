// JoinNowSection.js

import React from 'react';
import './JoinNowSection.css'

const JoinNowSection = () => {
  return (
    <section className="join-now-guest">
      <div className="container-services">
        <div className="join-now-content">
          <h2>Join Now and Start Your Journey</h2>
          <p>
            Sign up today and connect with top professionals from around the world. Whether
            you're looking for work or need talented freelancers, we've got you covered.
          </p>
          <button className="join-now-btn-guest">Join Now</button>
        </div>
        <div className="join-now-image">
        <img  src='https://cdn.pixabay.com/photo/2017/06/28/08/28/together-2450090_1280.jpg' alt="Join Now" />

        </div>
      </div>
    </section>
  );
};

export default JoinNowSection;
