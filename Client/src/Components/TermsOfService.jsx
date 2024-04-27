// TermsOfServicePage.js
import React, { useEffect } from 'react';
import './TermsOfService.css'; // Add your own CSS file for styling

const TermsOfServicePage = () => {

    useEffect(()=>{
        window.scrollTo(0,0)
    },[])

    return (
        <>
                    <h2 className="terms-of-service-heading">Terms of Service</h2>

        <div className="terms-of-service-page">
            <p>
                Welcome to [Your Company Name]!
            </p>
            <p>
                These terms and conditions outline the rules and regulations for the use of [Your Company Name]'s Website, located at [Website URL].
            </p>
            <p>
                By accessing this website we assume you accept these terms and conditions. Do not continue to use [Your Company Name] if you do not agree to take all of the terms and conditions stated on this page.
            </p>
            <p>
                The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
            </p>
        </div>
        </>
    );
};

export default TermsOfServicePage;
