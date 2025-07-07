import React from 'react';

const IndustryModal = ({ industry, onClose }) => {
  const industryData = {
    petroleum: {
      name: 'Oil & Gas Industry',
      icon: '⛽',
      pollution: 'Produces NO2, SO2, PM2.5, and VOCs through refining processes',
      pollutionPerKg: '2.3 kg CO2 per liter of gasoline',
      products: ['Gasoline', 'Diesel', 'Jet fuel', 'Plastics', 'Chemicals'],
      alternatives: ['Electric vehicles', 'Biofuels', 'Hydrogen fuel', 'Renewable energy']
    },
    chemical: {
      name: 'Chemical Manufacturing',
      icon: '🧪',
      pollution: 'Releases VOCs, benzene, formaldehyde, and toxic gases',
      pollutionPerKg: '1.8 kg CO2 per kg of chemical product',
      products: ['Fertilizers', 'Pesticides', 'Pharmaceuticals', 'Paints'],
      alternatives: ['Bio-based chemicals', 'Green chemistry', 'Recycled materials']
    },
    energy: {
      name: 'Power Generation',
      icon: '⚡',
      pollution: 'Coal and gas plants emit SO2, NOx, PM2.5, and mercury',
      pollutionPerKg: '0.82 kg CO2 per kWh (coal)',
      products: ['Electricity', 'Steam', 'Heat'],
      alternatives: ['Solar power', 'Wind energy', 'Nuclear power', 'Hydroelectric']
    }
  };

  const data = industryData[industry] || industryData.petroleum;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="industry-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <span className="industry-icon">{data.icon}</span>
          <h2>{data.name}</h2>
        </div>

        <div className="modal-content">
          <section>
            <h3>🌫️ Why This Industry Pollutes</h3>
            <p>{data.pollution}</p>
          </section>

          <section>
            <h3>📊 Pollution Impact</h3>
            <p><strong>Emissions:</strong> {data.pollutionPerKg}</p>
          </section>

          <section>
            <h3>🏭 Common Products</h3>
            <div className="product-list">
              {data.products.map((product, index) => (
                <span key={index} className="product-tag">{product}</span>
              ))}
            </div>
          </section>

          <section>
            <h3>🌱 Cleaner Alternatives</h3>
            <div className="alternative-list">
              {data.alternatives.map((alt, index) => (
                <span key={index} className="alternative-tag">{alt}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IndustryModal;