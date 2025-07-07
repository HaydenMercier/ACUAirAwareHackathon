import React, { useState } from 'react';
import ContactFooter from './ContactFooter';

const ContributingIndustries = () => {
  const [hoveredPollutant, setHoveredPollutant] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const pollutantInfo = {
    'CO₂': {
      name: 'Carbon Dioxide',
      atmospheric: 'Primary greenhouse gas causing global warming and climate change',
      health: 'High concentrations can cause drowsiness, headaches, and respiratory issues'
    },
    'SO₂': {
      name: 'Sulfur Dioxide',
      atmospheric: 'Causes acid rain and contributes to particulate matter formation',
      health: 'Irritates respiratory system, worsens asthma, and causes lung damage'
    },
    'NOₓ': {
      name: 'Nitrogen Oxides',
      atmospheric: 'Forms ground-level ozone and contributes to smog formation',
      health: 'Causes respiratory inflammation, reduced lung function, and asthma'
    },
    'CH₄': {
      name: 'Methane',
      atmospheric: '28x more potent greenhouse gas than CO₂ over 100-year period',
      health: 'Generally not toxic but displaces oxygen in high concentrations'
    },
    'N₂O': {
      name: 'Nitrous Oxide',
      atmospheric: '300x more potent than CO₂, depletes ozone layer',
      health: 'Can cause dizziness and euphoria; medical anesthetic in controlled doses'
    },
    'NH₃': {
      name: 'Ammonia',
      atmospheric: 'Forms particulate matter, contributes to eutrophication',
      health: 'Severe respiratory and eye irritant, can cause chemical burns'
    },
    'H₂S': {
      name: 'Hydrogen Sulfide',
      atmospheric: 'Contributes to acid rain and atmospheric sulfur compounds',
      health: 'Highly toxic, causes eye irritation, respiratory problems, and death at high levels'
    },
    'PM2.5': {
      name: 'Fine Particulate Matter',
      atmospheric: 'Reduces visibility, affects climate by scattering sunlight',
      health: 'Penetrates deep into lungs, causes heart disease, stroke, and lung cancer'
    },
    'PM10': {
      name: 'Coarse Particulate Matter',
      atmospheric: 'Reduces air quality and visibility',
      health: 'Causes respiratory irritation, aggravates asthma and bronchitis'
    },
    'CO': {
      name: 'Carbon Monoxide',
      atmospheric: 'Indirectly contributes to ground-level ozone formation',
      health: 'Prevents oxygen transport in blood, causes headaches, dizziness, and death'
    },
    'VOCs': {
      name: 'Volatile Organic Compounds',
      atmospheric: 'React with NOₓ to form ground-level ozone',
      health: 'Cause eye/respiratory irritation, headaches, and some are carcinogenic'
    },
    'Benzene': {
      name: 'Benzene',
      atmospheric: 'Contributes to ground-level ozone and smog formation',
      health: 'Known carcinogen, causes leukemia and other blood disorders'
    },
    'Mercury': {
      name: 'Mercury',
      atmospheric: 'Bioaccumulates in food chain, global atmospheric transport',
      health: 'Neurotoxin affecting brain development, especially dangerous for children'
    },
    'Dioxins': {
      name: 'Dioxins',
      atmospheric: 'Persistent organic pollutants, long-range atmospheric transport',
      health: 'Highly toxic carcinogens, cause reproductive and immune system damage'
    },
    'PFCs': {
      name: 'Perfluorocarbons',
      atmospheric: 'Extremely potent greenhouse gases with long atmospheric lifetimes',
      health: 'Generally low toxicity but some linked to cancer and liver damage'
    }
  };

  const handlePollutantHover = (pollutant, event) => {
    setHoveredPollutant(pollutant);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handlePollutantLeave = () => {
    setHoveredPollutant(null);
  };

  const industries = [
    {
      name: 'Energy Sector',
      icon: '⚡',
      image: '🏭',
      description: 'The energy sector is the largest contributor to global air pollution, responsible for approximately 75% of greenhouse gas emissions worldwide. Coal-fired power plants release sulfur dioxide (SO₂), nitrogen oxides (NOₓ), and particulate matter (PM2.5 and PM10) into the atmosphere. These pollutants contribute to smog formation, acid rain, and respiratory health issues. Natural gas facilities, while cleaner than coal, still emit methane and carbon dioxide. The sector also includes oil refineries that release volatile organic compounds (VOCs) and benzene.',
      facts: [
        'Accounts for 75% of global greenhouse gas emissions',
        'Coal plants emit 2.2 billion tons of CO₂ annually',
        'Responsible for 65% of global SO₂ emissions'
      ],
      pollutants: ['CO₂', 'SO₂', 'NOₓ', 'PM2.5', 'PM10', 'Mercury']
    },
    {
      name: 'Transportation',
      icon: '🚗',
      image: '🛣️',
      description: 'Transportation, particularly road vehicles, contributes approximately 16% of global greenhouse gas emissions. Cars, trucks, buses, and motorcycles burn fossil fuels, releasing carbon dioxide, nitrogen oxides, and particulate matter. Diesel vehicles are particularly problematic, emitting fine particulates that penetrate deep into lungs. Aviation and shipping also contribute significantly, with aircraft emissions affecting air quality at ground level and cruise altitude. Urban areas experience the highest concentration of transportation-related pollution.',
      facts: [
        'Road transport produces 12% of global CO₂ emissions',
        'Diesel vehicles emit 40x more NOₓ than gasoline cars',
        'Transportation causes 185,000 premature deaths annually'
      ],
      pollutants: ['CO₂', 'NOₓ', 'PM2.5', 'CO', 'Hydrocarbons', 'Benzene']
    },
    {
      name: 'Agriculture & Food Production',
      icon: '🌾',
      image: '🚜',
      description: 'Agriculture contributes about 24% of global greenhouse gas emissions through various pathways. Livestock farming produces methane through digestion and manure decomposition. Rice cultivation in flooded fields generates significant methane emissions. Fertilizer use releases nitrous oxide (N₂O), a potent greenhouse gas. Agricultural machinery and transportation of food products burn fossil fuels. Deforestation for farmland reduces carbon sequestration capacity while releasing stored carbon.',
      facts: [
        'Livestock produces 14.5% of global greenhouse gases',
        'Agriculture uses 70% of global freshwater',
        'Food production causes 80% of deforestation'
      ],
      pollutants: ['CH₄', 'N₂O', 'NH₃', 'PM10', 'CO₂', 'Pesticides']
    },
    {
      name: 'Industrial Manufacturing',
      icon: '🏭',
      image: '⚙️',
      description: 'Industrial manufacturing accounts for approximately 21% of global greenhouse gas emissions. Steel production alone generates 7% of global CO₂ emissions through coal combustion and chemical processes. Cement manufacturing releases CO₂ both from fuel combustion and limestone decomposition. Chemical plants emit various toxic compounds including volatile organic compounds (VOCs), sulfur compounds, and heavy metals. Aluminum smelting requires enormous energy input and releases perfluorocarbons (PFCs).',
      facts: [
        'Steel industry produces 2.6 billion tons of CO₂ annually',
        'Cement production accounts for 8% of global emissions',
        'Chemical industry emits 3.3 billion tons of CO₂ yearly'
      ],
      pollutants: ['CO₂', 'SO₂', 'VOCs', 'Heavy Metals', 'PFCs', 'Dioxins']
    },
    {
      name: 'Waste Management & Landfills',
      icon: '🗑️',
      image: '🏗️',
      description: 'Waste management contributes approximately 5% of global greenhouse gas emissions, but has significant local air quality impacts. Landfills generate methane as organic waste decomposes anaerobically. Waste incineration releases dioxins, furans, heavy metals, and particulate matter. Open burning of waste, common in developing countries, produces toxic smoke containing numerous harmful compounds. Recycling facilities can emit dust and chemical vapors during processing.',
      facts: [
        'Landfills produce 11% of global methane emissions',
        'Waste sector emits 1.6 billion tons of CO₂ equivalent',
        'Open waste burning affects 2.6 billion people globally'
      ],
      pollutants: ['CH₄', 'CO₂', 'Dioxins', 'Heavy Metals', 'PM2.5', 'H₂S']
    }
  ];

  return (
    <div className="contributing-industries-page">
      <div className="industries-hero">
        <h1>Industries Contributing to Global Air Pollution</h1>
        <p className="hero-subtitle">Understanding the major sources of air pollution and their environmental impact</p>
      </div>

      <div className="industries-content">
        {industries.map((industry, index) => (
          <section key={index} className="industry-section">
            <div className="industry-header">
              <div className="industry-visual">
                <span className="industry-main-icon">{industry.icon}</span>
                <span className="industry-image">{industry.image}</span>
              </div>
              <div className="industry-title">
                <h2>{industry.name}</h2>
              </div>
            </div>

            <div className="industry-content">
              <div className="industry-description">
                <p>{industry.description}</p>
              </div>

              <div className="industry-widgets">
                <div className="facts-widget">
                  <h3>Key Facts</h3>
                  <ul>
                    {industry.facts.map((fact, factIndex) => (
                      <li key={factIndex}>{fact}</li>
                    ))}
                  </ul>
                </div>

                <div className="pollutants-widget">
                  <h3>Main Pollutants</h3>
                  <div className="pollutant-tags">
                    {industry.pollutants.map((pollutant, pollutantIndex) => (
                      <span 
                        key={pollutantIndex} 
                        className="pollutant-tag"
                        onMouseEnter={(e) => handlePollutantHover(pollutant, e)}
                        onMouseLeave={handlePollutantLeave}
                      >
                        {pollutant}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>


      {hoveredPollutant && pollutantInfo[hoveredPollutant] && (
        <div 
          className="pollutant-tooltip"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10
          }}
        >
          <h4>{pollutantInfo[hoveredPollutant].name}</h4>
          <p><strong>Atmospheric Impact:</strong> {pollutantInfo[hoveredPollutant].atmospheric}</p>
          <p><strong>Health Impact:</strong> {pollutantInfo[hoveredPollutant].health}</p>
        </div>
      )}

      <ContactFooter />
    </div>
  );
};

export default ContributingIndustries;