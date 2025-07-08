import React from 'react';
import ContactFooter from './ContactFooter';
import smokestackIcon from '../icons/smokestackiconwhite.png';

const HomePage = ({ onEnterApp, onNavigateSimulator }) => {
  const leadingIndustries = [
    {
      name: 'Oil & Gas',
      icon: '⛽',
      pollution: 'NO₂, SO₂, PM2.5',
      impact: '24% of global emissions',
      description: 'Refineries and extraction operations release nitrogen oxides and particulates'
    },
    {
      name: 'Coal Power',
      icon: '⚡',
      pollution: 'SO₂, PM10, Mercury',
      impact: '30% of global CO₂',
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
    },
    {
      name: 'Agriculture',
      icon: '🌾',
      pollution: 'NH₃, Pesticides, PM10',
      impact: '14% of air pollution sources',
      description: 'Livestock farming and crop production release ammonia and particulate matter'
    },
    {
      name: 'Mining',
      icon: '⛏️',
      pollution: 'PM10, Heavy Metals, SO₂',
      impact: '8% of industrial emissions',
      description: 'Extraction and processing operations release dust and toxic compounds'
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-logo">
          <img src={smokestackIcon} alt="SmokeStack" className="hero-main-logo" />
        </div>
        <p className="tagline">Track Industrial Air Pollution Impact</p>
        <div className="hero-buttons">
          <button className="enter-app-btn" onClick={onEnterApp}>
            Explore Air Quality Data
          </button>
          <button className="simulator-btn" onClick={onNavigateSimulator}>
            🌍 Try Pollution Simulator
          </button>
        </div>
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
      
      <div className="quick-facts-section">
        <div className="education-panel">
          <h3>💡 Quick Facts</h3>
          <ul>
            <li>PM2.5 particles are 30x smaller than human hair width</li>
            <li>Oil refineries are major sources of NO2 emissions</li>
            <li>Chemical plants often release SO2 compounds</li>
            <li>Wind direction affects pollution dispersion patterns</li>
          </ul>
        </div>
      </div>
      
      <ContactFooter />
    </div>
  );
};

export default HomePage;