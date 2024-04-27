// Home.js

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
// import HowItWorksSection from './HowItWorksSection';
// import TestimonialsSection from './TestimonialsSection';
import JoinNowSection from './JoinNowSection';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { Redirect } from 'react-router-dom';

// import Footer from './Footer';

const Home = () => {

  const { isLoggedIn, userRole } = useContext(UserContext);

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  if (isLoggedIn) {
    // Check if the user is logged in and redirect them to their respective home page
    if (userRole === 'freelancer') {
      return <Redirect to="/freelancerHome" />;
    } else if (userRole === 'client') {
      return <Redirect to="/jobsPage" />;
    }
  }

  return (
    <div>
      <HeroSection />
      <ServicesSection />
      {/* <HowItWorksSection /> */}
      {/* <TestimonialsSection /> */}
      <JoinNowSection />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
