import React, { useEffect } from 'react';
import './HowItWorksPage.css'; // Add your own CSS file for styling

const HowItWorksPage = () => {

    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);

    return (
        <>
         <h2 className="how-it-works-heading">How It Works</h2>
        <div className="how-it-works-page">
           
            <div className="step">
                <div className="step-number">Step 1</div>
                <div className="step-content">
                    <h3>Sign Up or Log In</h3>
                    <p>Create an account or log in to get started. It's easy and free!</p>
                </div>
            </div>
            <div className="step">
                <div className="step-number">Step 2</div>
                <div className="step-content">
                    <h3>Post Your Project</h3>
                    <p>Describe your project and requirements. Freelancers will review and place bids.</p>
                </div>
            </div>
            <div className="step">
                <div className="step-number">Step 3</div>
                <div className="step-content">
                    <h3>Hire a Freelancer</h3>
                    <p>Review bids, chat with freelancers, and hire the one that fits your needs.</p>
                </div>
            </div>
            <div className="step">
                <div className="step-number">Step 4</div>
                <div className="step-content">
                    <h3>Work and Collaborate</h3>
                    <p>Collaborate with your chosen freelancer, monitor progress, and communicate easily.</p>
                </div>
            </div>
            <div className="step">
                <div className="step-number">Step 5</div>
                <div className="step-content">
                    <h3>Complete and Pay</h3>
                    <p>Once satisfied, approve the work and release payment to the freelancer.</p>
                </div>
            </div>
        </div>
        </>
    );
};

export default HowItWorksPage;
