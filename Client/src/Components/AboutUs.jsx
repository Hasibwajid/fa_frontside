import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AboutUs.css'; // Add your own CSS file for styling

const AboutUsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    
    return (
        <Container className="about-us-page">
            <Row>
                <Col md={8} className="about-text">
                    <h2 className="about-heading">About Us</h2>
                    <p>
                        Welcome to <span className="platform-name">[Your Platform Name]</span>, your ultimate destination for connecting
                        Pakistani freelancers and clients. Our mission is to empower individuals and businesses by providing a seamless,
                        secure, and efficient platform for outsourcing and collaboration.
                    </p>
                    <p>
                        At <span className="platform-name">[Your Platform Name]</span>, we are driven by innovation, professionalism, and
                        a deep understanding of the Pakistani market. Our goal is to create a community of excellence, where talent flourishes,
                        opportunities abound, and success is celebrated.
                    </p>
                    <p>
                        By choosing <span className="platform-name">[Your Platform Name]</span>, you're supporting local expertise while
                        accessing global-quality services right here in Pakistan. Join us on this journey to reshape how projects are executed,
                        businesses thrive, and partnerships flourish.
                    </p>
                    <p>
                        We invite you to be part of the <span className="platform-name">[Your Platform Name]</span> family and experience
                        the future of freelancing in Pakistan.
                    </p>
                </Col>
                <Col md={4} className="about-image">
                <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="About Us" /> 
                </Col>
            </Row>
        </Container>
    );
};

export default AboutUsPage;
