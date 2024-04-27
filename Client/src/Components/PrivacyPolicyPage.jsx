import React, { useEffect } from 'react';
import './PrivacyPolicyPage.css'; // Add your own CSS file for styling

const PrivacyPolicyPage = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
        <header className="privacy-policy-header">
                <h1>Privacy Policy</h1>
            </header>
        <div className="privacy-policy-page">
            
            <section className="policy-section">
                <h2>Your Privacy Matters</h2>
                <p>We are committed to respecting and protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information.</p>
            </section>
            <section className="policy-section">
                <h2>Information Collection</h2>
                <p>We collect information when you sign up, use our services, and interact with our platform. This may include your name, contact details, and usage data.</p>
            </section>
            <section className="policy-section">
                <h2>Use of Information</h2>
                <p>We use your information to provide and improve our services, personalize your experience, and communicate with you. We do not sell your data to third parties.</p>
            </section>
            <section className="policy-section">
                <h2>Data Security</h2>
                <p>We implement security measures to protect your data. However, no method of transmission over the internet is completely secure, and we cannot guarantee its absolute security.</p>
            </section>
            <section className="policy-section">
                <h2>Changes to Policy</h2>
                <p>We may update this Privacy Policy to reflect changes in our practices or for legal reasons. We will notify you of any significant changes and provide you with choices regarding your data.</p>
            </section>
            
        </div>
        <footer className="privacy-policy-footer">
                <p>&copy; 2023 YourCompany. All rights reserved.</p>
            </footer>
        </>
    );
};

export default PrivacyPolicyPage;
