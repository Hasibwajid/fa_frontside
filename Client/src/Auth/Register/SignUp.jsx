import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css'
import FreelancerForm from './FreelancerForm';
import ClientForm from './ClientForm';
// Import your form fields/components for Freelancer and Client


const SignUp = () => {
  const [userType, setUserType] = useState('freelancer'); // Default to Freelancer

  const handleUserTypeChange = (selectedType) => {
    setUserType(selectedType);
  };
  
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  

  // Render the appropriate sign-up form based on userType
  const renderSignUpForm = () => {
    if (userType === 'freelancer') {
      return <FreelancerForm />;
    } else {
      return <ClientForm />
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-options">
        <h2>How do you want to sign up?</h2>
        <div className="options-buttons">
          <button className="option-button" onClick={() => handleUserTypeChange('freelancer')}>
            Sign Up as Freelancer
          </button>
          <button className="option-button" onClick={() => handleUserTypeChange('client')}>
            Sign Up as Client
          </button>
        </div>
      </div>
      <div className="sign-up-form">{renderSignUpForm()}</div>
    </div>
  );
};

export default SignUp;
