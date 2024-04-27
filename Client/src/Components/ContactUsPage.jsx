// ContactUsPage.js
import React, { useEffect } from 'react';
import './ContactUs.css'; // Add your own CSS file for styling

const ContactUsPage = () => {

    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])
    return (
        <div className="contact-us-page">
            <h2 className="contact-heading">Contact Us</h2>
            <div className="contact-details">
                <p>If you have any questions or inquiries, please don't hesitate to contact us. Our team is here to assist you.</p>
                <div className="contact-methods">
                    <div className="contact-method">
                        <h4>Email</h4>
                        <p>Email us at <a href="mailto:info@yourplatformname.com">support@yourplatformname.com</a></p>
                    </div>
                    <div className="contact-method">
                        <h4>Phone</h4>
                        <p>Call us at <a href="tel:+1234567890">+92 123-456-789</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
