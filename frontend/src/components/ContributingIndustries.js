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
      name: 'Hydrogen Sulphide',
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
    },
    'Pesticides': {
      name: 'Pesticides',
      atmospheric: 'Drift into atmosphere, contaminate water sources, harm beneficial insects',
      health: 'Linked to cancer, neurological disorders, reproductive issues, and endocrine disruption'
    },
    'Heavy Metals': {
      name: 'Heavy Metals',
      atmospheric: 'Persist in environment, bioaccumulate in food chains, long-range transport',
      health: 'Cause organ damage, developmental disorders, cancer, and neurological problems'
    },
    'Hydrocarbons': {
      name: 'Hydrocarbons',
      atmospheric: 'React with NOₓ to form ground-level ozone and photochemical smog',
      health: 'Cause respiratory irritation, some are carcinogenic and affect central nervous system'
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
      description: 'The energy sector is the biggest source of air pollution responsible for 75% of all greenhouse gas emissions. Coal power plants contribute the most, burning over 8 billion tons of coal every year, pumping out sulfur dioxide, nitrogen oxides, and tiny particles that we breathe in. This pollution causes smog in cities, acid rain, and serious breathing problems for millions of people. Coal plants also release mercury, a toxic metal that can damage children\'s brain development. Natural gas plants are cleaner than coal but can still cause problems through methane leaks during drilling and transport, methane traps 28 times more heat than carbon dioxide. Oil refineries also release chemicals like benzene and other compounds that create smog and increase the risk of cancer in nearby communities.',
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
      description: 'Transportation accounts for 16% of global air pollution, especially cars, trucks, buses, and motorcycles. When these vehicles burn gasoline or diesel, they release carbon dioxide, nitrogen oxides, carbon monoxide, and other harmful chemicals into the air we breathe. Diesel vehicles are especially bad as they produce tiny particles that penetrate our lungs, causing heart disease, strokes, and lung cancer. Diesel trucks and buses produce 40 times more nitrogen oxides than regular cars, which is why city air is often so polluted. Planes are also a problem too, releasing pollution high in the atmosphere where it has a stronger impact on the greenhouse effect. Ships that carry goods around the world burn dirty fuel oil that contains lots of sulfur, creating pollution that affects coastal cities and makes the ocean more acidic.',
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
      description: 'Farming and food production create 24% of global air pollution. The biggest contributor comes from livestock, over 1 billion cows produce methane when they digest and excrete food. This methane traps huge amounts of heat, making cattle farming a major cause of global warming. Rice farming also produces methane because rice grows in flooded fields where bacteria create this gas. Farmers use nitrogen fertilisers that release nitrous oxide. Pesticides and herbicides used on crops evaporate into the air, polluting both air and water while killing natural wildlife. When forests are cleared to create farmland, carbon stored in trees gets released into the atmosphere, sadly, food production causes 80% of deforestation worldwide.',
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
      description: 'Manufacturing industries produce 21% of global air pollution by making products all around us. Steel production is one of the worst polluters, creating 7% of all carbon dioxide emissions because it requires the addition of coke and burning huge amounts of coal to melt iron ore. Making one ton of steel needs 1.4 tons of coal and releases toxic dust and gases that make people sick in steel-making areas. Cement production is also a major problem because it releases carbon dioxide both from burning fuel and from the chemical process of breaking down limestone. Chemical factories release many toxic compounds including benzene and formaldehyde, which can cause cancer and create smog. Making aluminum requires massive amounts of electricity and releases some of the most powerful greenhouse gases, some of which remain in the atmosphere for over 10,000 years and trap huge amounts of heat, contributing to global warming.',
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
      description: 'Waste management creates 5% of global air pollution, but the impact on local communities can be severe. Landfills produce methane gas as garbage rots, contributing 11% of all methane emissions worldwide. This gas production continues for decades after trash is buried, making landfills long-term pollution sources. Waste incinerators burn trash to reduce volume but release extremely toxic chemicals including dioxins (some of the most poisonous substances known), mercury, lead, and tiny particles that can travel far and build up in our food. These facilities are often built in poor neighborhoods, unfairly exposing these communities to more pollution. Around 2.6 billion people worldwide burn their trash in the open because they don\'t have proper waste collection, creating toxic smoke that causes immediate breathing problems and long-term health issues. Even recycling facilities create pollution through plastic particles, chemical vapours, and produce less air pollution than garbage dumps, but this shows we need to focus more on reducing waste rather than just managing it,.',
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
        <h1>Top 5 Contributing Industries to Global Air Pollution</h1>
        <p className="hero-subtitle">Understanding the major sources of air pollution and their environmental impact</p>
      </div>

      <div className="industries-content">
        {industries.map((industry, index) => (
          <section key={index} className="industry-section">
            <div className="industry-header">
              <div className="industry-title">
                <h2>{industry.name}</h2>
              </div>
            </div>

            <div className="industry-content">
              <div className="industry-description">
                {industry.name === 'Energy Sector' && (
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAT-n43ar2rLcEVTdbr0VI0WCtRozW-VFgJ9SR8VFov9PJjx86pZ43gT9HLZJvLvxk2v8&usqp=CAU" 
                    alt="Coal power plant with smokestacks" 
                    className="industry-inline-image"
                  />
                )}
                {industry.name === 'Agriculture & Food Production' && (
                  <img 
                    src="https://media02.stockfood.com/largepreviews/MjIwNzIwMjYzNQ==/71200085-A-herd-of-cows-standing-in-a-grass-field-under-a-cloudy-sky-with-a-silhouette-of-the-Rocky-mountains-in-the.jpg" 
                    alt="Herd of cows in grass field" 
                    className="industry-inline-image"
                  />
                )}
                {industry.name === 'Transportation' && (
                  <img 
                    src="https://www.ox.ac.uk/sites/files/oxford/field/field_image_main/shutterstock_554001493.jpg" 
                    alt="Heavy traffic with vehicle emissions" 
                    className="industry-inline-image"
                  />
                )}
                {industry.name === 'Industrial Manufacturing' && (
                  <img 
                    src="https://beltmag.com/wp-content/uploads/2018/04/F1013STEEL_BILLBOARD_21545729-e1522925068228.jpg" 
                    alt="Steel manufacturing plant with smokestacks" 
                    className="industry-inline-image"
                  />
                )}
                {industry.name === 'Waste Management & Landfills' && (
                  <img 
                    src="https://images.ctfassets.net/cxgxgstp8r5d/3391602421c90298e02043008e5b7900/d6e8ab2af495105725dcb75f885d82c9/9_2_14_Andrea_Mexico_trash_500_375_s_c1_c_c.jpg" 
                    alt="Open waste burning and landfill" 
                    className="industry-inline-image"
                  />
                )}
                {industry.description.split('. ').reduce((paragraphs, sentence, index, array) => {
                  const sentenceWithPeriod = sentence + (index < array.length - 1 ? '.' : '');
                  const paragraphIndex = Math.floor(index / 3);
                  if (!paragraphs[paragraphIndex]) paragraphs[paragraphIndex] = [];
                  paragraphs[paragraphIndex].push(sentenceWithPeriod);
                  return paragraphs;
                }, []).map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph.join(' ')}</p>
                ))}
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

      <div className="action-section">
        <h2>Take Action for Cleaner Air</h2>
        <div className="household-actions">
          <div className="action-item">
            <h4>Install Solar Panels</h4>
            <p>Switch from coal-powered electricity to solar energy. Government subsidies can reduce installation costs by 30-50%, and solar panels typically pay for themselves within 6-10 years through lower electricity bills. Solar energy produces zero emissions compared to coal power, which releases 2.2 billion tons of CO₂ annually.</p>
          </div>
          <div className="action-item">
            <h4>Choose Electric or Hybrid Vehicles</h4>
            <p>Replace gasoline cars with electric vehicles to eliminate direct emissions. EVs produce 60% fewer emissions than gas cars over their lifetime, even accounting for electricity generation. Many governments offer tax incentives up to $7,500 for EV purchases.</p>
          </div>
          <div className="action-item">
            <h4>Use LED Light Bulbs</h4>
            <p>Replace incandescent bulbs with LEDs, which use 75% less energy and last 25 times longer. A typical household can save $75 annually on electricity bills while reducing CO₂ emissions by 1,000 pounds per year.</p>
          </div>
          <div className="action-item">
            <h4>Buy Local and Organic Food</h4>
            <p>Choose locally grown, organic produce to reduce transportation emissions and pesticide use. Local food travels 27 times less distance than conventional food, cutting transportation-related CO₂ emissions significantly.</p>
          </div>
          <div className="action-item">
            <h4>Use Eco-Friendly Cleaning Products</h4>
            <p>Switch to plant-based, biodegradable cleaners that don't release volatile organic compounds (VOCs) into your home air. These products reduce indoor air pollution and prevent harmful chemicals from entering waterways.</p>
          </div>
          <div className="action-item">
            <h4>Install a Programmable Thermostat</h4>
            <p>Smart thermostats can reduce heating and cooling energy use by 10-15%, saving $180 annually while cutting CO₂ emissions. They automatically adjust temperature when you're away, optimizing energy efficiency.</p>
          </div>
          <div className="action-item">
            <h4>Choose Reusable Products</h4>
            <p>Replace single-use items with reusable alternatives like water bottles, shopping bags, and food containers. This reduces plastic waste that releases toxic chemicals when burned in incinerators or decomposing in landfills.</p>
          </div>
          <div className="action-item">
            <h4>Use Public Transportation</h4>
            <p>Take buses, trains, or bikes instead of driving alone. Public transit produces 45% fewer CO₂ emissions per passenger mile than private vehicles. A single bus can replace 40 cars on the road during peak hours.</p>
          </div>
          <div className="action-item">
            <h4>Plant Trees and Gardens</h4>
            <p>Plant native trees and maintain gardens to absorb CO₂ from the atmosphere. A mature tree absorbs 48 pounds of CO₂ annually, while home gardens reduce the need for transported produce and provide natural air filtration.</p>
          </div>
          <div className="action-item">
            <h4>Choose Energy-Efficient Appliances</h4>
            <p>Buy ENERGY STAR certified appliances that use 10-50% less energy than standard models. An efficient refrigerator can save $300 over its lifetime while preventing 3,000 pounds of CO₂ emissions annually.</p>
          </div>
        </div>
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