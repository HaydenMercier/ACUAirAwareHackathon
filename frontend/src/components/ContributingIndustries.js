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
      description: 'The energy sector stands as the single largest contributor to global air pollution, accounting for approximately 75% of worldwide greenhouse gas emissions. Coal-fired power plants represent the most significant source within this sector, burning over 8 billion tons of coal annually and releasing massive quantities of sulfur dioxide (SO₂), nitrogen oxides (NOₓ), and fine particulate matter (PM2.5 and PM10) directly into the atmosphere. These emissions create a cascade of environmental problems, contributing to smog formation in urban areas, acid rain that damages ecosystems and infrastructure, and severe respiratory health issues affecting millions of people globally.\n The combustion process in coal plants also releases mercury, a potent neurotoxin that bioaccumulates in food chains and poses particular risks to developing children. Natural gas facilities, while producing roughly half the CO₂ emissions of coal plants, still contribute significantly to atmospheric pollution through methane leaks during extraction and transport, with methane being 28 times more potent as a greenhouse gas than carbon dioxide over a 100-year period. The energy sector also encompasses oil refineries, which process crude oil into various petroleum products while releasing volatile organic compounds (VOCs), benzene, and other toxic substances that contribute to ground-level ozone formation and pose serious carcinogenic risks to nearby communities.',
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
      description: 'The transportation sector represents a critical source of air pollution, contributing approximately 16% of global greenhouse gas emissions while creating concentrated pollution hotspots in urban environments worldwide. Road vehicles, including cars, trucks, buses, and motorcycles, burn fossil fuels in internal combustion engines that release not only carbon dioxide but also nitrogen oxides, carbon monoxide, and various hydrocarbons into the atmosphere. Diesel vehicles pose particularly severe health risks, emitting fine particulate matter (PM2.5) that penetrates deep into lung tissue and enters the bloodstream, causing cardiovascular disease, stroke, and lung cancer. Heavy-duty diesel trucks and buses emit up to 40 times more nitrogen oxides than gasoline vehicles, contributing significantly to urban smog formation and respiratory ailments in densely populated areas. Aviation represents a rapidly growing source of emissions, with aircraft releasing pollutants directly into the upper atmosphere where they have enhanced warming effects, while also contributing to contrail formation that affects regional climate patterns. The shipping industry, responsible for transporting 90% of global trade, burns heavy fuel oil that contains high sulfur content, releasing sulfur dioxide and particulate matter that affects coastal air quality and contributes to ocean acidification through atmospheric deposition.',
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
      description: 'Agriculture and food production systems contribute approximately 24% of global greenhouse gas emissions through multiple interconnected pathways that extend far beyond the farm gate. Livestock farming represents the largest single source within this sector, with the world\'s 1 billion cattle producing methane through their digestive processes and manure decomposition, releasing approximately 100 million tons of methane annually into the atmosphere. This biological methane production is particularly concerning because methane traps 28 times more heat than carbon dioxide over a 100-year period, making livestock farming a significant driver of climate change. Rice cultivation, which feeds nearly half the world\'s population, occurs primarily in flooded fields that create anaerobic conditions perfect for methane-producing bacteria, contributing roughly 12% of global methane emissions while also requiring intensive water use that strains freshwater resources. The widespread application of nitrogen-based fertilizers releases nitrous oxide (N₂O), a greenhouse gas that is 300 times more potent than carbon dioxide and also contributes to ozone layer depletion. Modern industrial agriculture relies heavily on synthetic pesticides and herbicides that volatilize into the atmosphere, contaminating air and water resources while harming beneficial insects and pollinators essential for ecosystem health. Additionally, the conversion of forests and grasslands to agricultural use releases massive amounts of stored carbon while eliminating natural carbon sinks, with food production being responsible for approximately 80% of global deforestation.',
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
      description: 'Industrial manufacturing represents a massive source of air pollution, accounting for approximately 21% of global greenhouse gas emissions while releasing a complex mixture of toxic substances that threaten both environmental and human health. Steel production stands as one of the most polluting industrial processes, generating 7% of global CO₂ emissions through the combustion of coking coal and the chemical reduction of iron ore, while also releasing sulfur dioxide, nitrogen oxides, and particulate matter that create severe air quality problems in steel-producing regions. The industry consumes approximately 20% of global energy and produces over 2.6 billion tons of CO₂ annually, with each ton of steel requiring 1.4 tons of coal and generating significant quantities of toxic slag and dust. Cement manufacturing presents unique challenges as it releases CO₂ through both fuel combustion and the chemical decomposition of limestone (calcium carbonate), making it responsible for approximately 8% of global emissions while producing alkaline dust that affects respiratory health in surrounding communities. Chemical manufacturing facilities emit an extensive array of volatile organic compounds (VOCs), including benzene, toluene, and formaldehyde, which contribute to ground-level ozone formation and pose serious carcinogenic risks to workers and nearby residents. Aluminum smelting requires enormous amounts of electricity, typically generated from fossil fuels, while also releasing perfluorocarbons (PFCs) that are among the most potent greenhouse gases known, with some having atmospheric lifetimes exceeding 10,000 years and global warming potentials thousands of times greater than CO₂.',
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
      description: 'Waste management and landfill operations contribute approximately 5% of global greenhouse gas emissions while creating severe localized air quality problems that disproportionately affect low-income communities and developing nations. Modern sanitary landfills generate methane as organic waste decomposes in anaerobic conditions, with the world\'s landfills producing roughly 11% of global methane emissions, equivalent to approximately 1.6 billion tons of CO₂. This methane production continues for decades after waste disposal, making landfills long-term sources of greenhouse gas emissions that require active management and monitoring systems. Waste incineration facilities, while reducing waste volume by up to 90%, release a cocktail of toxic substances including dioxins and furans (among the most toxic compounds known to science), heavy metals like mercury and lead, and fine particulate matter that can travel long distances and accumulate in food chains. These facilities disproportionately impact environmental justice communities, as they are often located in areas with higher concentrations of minority and low-income residents. Open burning of waste, practiced by an estimated 2.6 billion people globally who lack access to proper waste collection services, produces highly toxic smoke containing polycyclic aromatic hydrocarbons, dioxins, and other carcinogenic compounds that cause immediate respiratory distress and long-term health problems. Even recycling facilities contribute to air pollution through the emission of plastic microparticles, chemical vapors from processing operations, and dust from paper and cardboard handling, highlighting the need for comprehensive waste reduction strategies that prioritize prevention over end-of-pipe solutions.',
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
        <div className="action-grid">
          <div className="action-card">
            <h3>🌱 Individual Actions</h3>
            <ul>
              <li>Use public transportation or electric vehicles</li>
              <li>Reduce energy consumption at home</li>
              <li>Choose renewable energy sources</li>
              <li>Support sustainable agriculture</li>
            </ul>
          </div>
          <div className="action-card">
            <h3>🏛️ Policy Support</h3>
            <ul>
              <li>Advocate for stricter emission standards</li>
              <li>Support renewable energy initiatives</li>
              <li>Promote industrial pollution regulations</li>
              <li>Encourage waste reduction policies</li>
            </ul>
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