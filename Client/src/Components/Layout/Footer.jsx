import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>Company</h4>
          <ul>
          <li ><Link style={{}} to="/AboutUs">About Us</Link></li>
            <li>Blog</li>
            <li>Careers</li>
            <li><Link style={{}} to="/ContactUs">Contact Us</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Services</h4>
          <ul>
            <li>Freelancers</li>
            <li>Projects</li>
            <li>Enterprise</li>
            <li>Preferred Freelancer Program</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li>Help & Support</li>
            <li>Trust & Safety</li>
            <li>Selling on Upwork</li>
            <li>Buying on Upwork</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><Link style={{}} to="/TermsOfServices">Terms of Service</Link></li>
            <li><Link style={{}} to="/Privacy$Policy">Privacy Policy</Link></li>
            <li>Accessibility</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-social-icons">
          <FaFacebookF />
          <FaTwitter />
          <FaLinkedinIn />
          <FaInstagram />
        </div>
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
