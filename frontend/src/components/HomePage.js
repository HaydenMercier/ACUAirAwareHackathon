import React from 'react';
import ContactFooter from './ContactFooter';

const HomePage = ({ onEnterApp }) => {
  const leadingIndustries = [
    {
      name: 'Oil & Gas',
      icon: '⛽',
      pollution: 'NO2, SO2, PM2.5',
      impact: '24% of global emissions',
      description: 'Refineries and extraction operations release nitrogen oxides and particulates'
    },
    {
      name: 'Coal Power',
      icon: '⚡',
      pollution: 'SO2, PM10, Mercury',
      impact: '30% of global CO2',
      description: 'Coal combustion produces sulfur dioxide and fine particulate matter'
    },
    {
      name: 'Chemical Manufacturing',
      icon: '🧪',
      pollution: 'VOCs, Benzene, Formaldehyde',
      impact: '7% of industrial emissions',
      description: 'Chemical processes release volatile organic compounds and toxic gases'
    },
    {
      name: 'Steel & Metal',
      icon: '🏭',
      pollution: 'PM2.5, CO, Heavy Metals',
      impact: '11% of industrial emissions',
      description: 'Smelting and processing release carbon monoxide and metal particulates'
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>🏭 Smokestack</h1>
        <p className="tagline">Track Industrial Air Pollution Impact</p>
        <button className="enter-app-btn" onClick={onEnterApp}>
          Explore Air Quality Data
        </button>
      </div>

      <div className="industries-section">
        <h2>Leading Industries Contributing to Air Pollution</h2>
        <div className="industry-grid">
          {leadingIndustries.map((industry, index) => (
            <div key={index} className="industry-card">
              <div className="industry-icon">{industry.icon}</div>
              <h3>{industry.name}</h3>
              <div className="pollution-types">{industry.pollution}</div>
              <div className="impact">{industry.impact}</div>
              <p className="description">{industry.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <h3>7 million</h3>
          <p>Deaths annually from air pollution</p>
        </div>
        <div className="stat-item">
          <h3>91%</h3>
          <p>Of world population breathes polluted air</p>
        </div>
        <div className="stat-item">
          <h3>$2.9 trillion</h3>
          <p>Annual economic cost of air pollution</p>
        </div>
      </div>
      
      <ContactFooter />
    </div>
  );
};

export default HomePage;