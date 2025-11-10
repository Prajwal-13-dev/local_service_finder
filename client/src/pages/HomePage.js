import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function HomePage() {

  // A list of your services using IMAGES
  const services = [
    { name: 'Carpenter', icon: 'carpenter.png', category: 'Carpenter' },
    { name: 'Electrician', icon: 'electrician.png', category: 'Electrician' },
    { name: 'Plumber', icon: 'plumber.png', category: 'Plumber' },
    { name: 'Painter', icon: 'painter.png', category: 'Painter' },
    { name: 'Cleaner', icon: 'cleaner.png', category: 'Cleaner' },
    { name: 'General', icon: 'general.png', category: 'General' } // Links to all providers
  ];

  return (
    <div className="homepage-container">
      {/* This is the center house icon that you click */}
      {/* It now links directly to the 'All Services' page */}
      <Link to="/providers" className="center-house-icon">
        <img src="/images/house.png" alt="All Services" />
      </Link>

      {/* This is the big dotted circle, now always visible */}
      <div className="services-circle open">
        
        {services.map((service, index) => (
          <Link 
            to={`/providers${service.category ? '?category=' + service.category : ''}`} 
            className="service-icon"
            style={{ '--index': index }} 
            key={service.name}
          >
            <img src={`/images/${service.icon}`} alt={service.name} />
            <span>{service.name}</span>
          </Link>
        ))}

      </div>
    </div>
  );
}

export default HomePage;