// ServicesSection.js

import React from 'react';
import './ServicesSection.css'

const servicesData = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Build custom web applications to meet your business needs.',
    image: '/images/web-development.jpg',
  },
  {
    id: 2,
    title: 'Graphic Design',
    description: 'Create stunning visuals and designs for your brand.',
    image: '/images/graphic-design.jpg',
  },
  {
    id: 3,
    title: 'Digital Marketing',
    description: 'Grow your online presence with effective digital marketing strategies.',
    image: '/images/digital-marketing.jpg',
  },
  // Add more services here
];

const ServicesSection = () => {
  return (
    <section className="services">
      <div className="container">
        <h2>Our Services</h2>
        <div className="services-grid-container">
          {servicesData.map((service) => (
            <div key={service.id} className="service-item">
              <img src={service.image} alt={service.title} />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
