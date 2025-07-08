import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InsightsExport = ({ 
  selectedLocation, 
  airQualityData, 
  industries, 
  activeHeatmaps, 
  locationInfo,
  correlationData 
}) => {
  
  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 25;
    
    // Header with branding
    pdf.setFillColor(102, 126, 234);
    pdf.rect(0, 0, pageWidth, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    const headerText = 'Smokestack - Air Quality Insights Report';
    const headerWidth = pdf.getTextWidth(headerText);
    pdf.text(headerText, (pageWidth - headerWidth) / 2, 10);
    
    // Location and date
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.text(`${locationInfo?.city || 'Unknown Location'}, ${locationInfo?.country || ''}`, 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(10);
    pdf.text(`Latitude: ${selectedLocation.lat.toFixed(4)}, Longitude: ${selectedLocation.lon.toFixed(4)} | Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;
    
    // Capture map screenshot
    try {
      const mapElement = document.querySelector('.leaflet-container');
      if (mapElement) {
        // Hide zoom controls before capture
        const zoomControls = document.querySelector('.leaflet-control-zoom');
        if (zoomControls) zoomControls.style.display = 'none';
        
        const canvas = await html2canvas(mapElement, {
          useCORS: true,
          allowTaint: true,
          scale: 1.2,
          backgroundColor: '#ffffff',
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0
        });
        
        // Restore zoom controls
        if (zoomControls) zoomControls.style.display = 'block';
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 20, yPosition, 170, 100);
        yPosition += 110;
      }
    } catch (error) {
      console.log('Map screenshot failed, continuing without image');
    }
    
    // Air Quality Summary Box
    pdf.setFillColor(248, 249, 250);
    pdf.rect(20, yPosition, 170, 45, 'F');
    pdf.setDrawColor(102, 126, 234);
    pdf.setLineWidth(1);
    pdf.rect(20, yPosition, 170, 45);
    
    pdf.setFontSize(16);
    pdf.setTextColor(102, 126, 234);
    pdf.text('Air Quality Summary', 25, yPosition + 12);
    
    // Main AQI display
    const aqiLevel = getAQILevel(airQualityData?.aqi);
    const aqiColor = getAQIColor(airQualityData?.aqi);
    pdf.setFontSize(24);
    pdf.setTextColor(aqiColor[0], aqiColor[1], aqiColor[2]);
    pdf.text(`${airQualityData?.aqi || 'N/A'}`, 25, yPosition + 28);
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${aqiLevel}`, 45, yPosition + 28);
    
    pdf.setFontSize(10);
    pdf.text('European AQI (1-5 Scale)', 25, yPosition + 35);
    
    // Pollutant measurements in grid
    if (airQualityData?.components) {
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`PM2.5: ${airQualityData.components.pm2_5?.toFixed(1) || 'N/A'} μg/m³`, 110, yPosition + 20);
      pdf.text(`NO₂: ${airQualityData.components.no2?.toFixed(1) || 'N/A'} μg/m³`, 110, yPosition + 28);
      pdf.text(`SO₂: ${airQualityData.components.so2?.toFixed(1) || 'N/A'} μg/m³`, 110, yPosition + 36);
    }
    yPosition += 55;
    
    // AQI Legend Box
    pdf.setFillColor(248, 249, 250);
    pdf.rect(20, yPosition, 170, 35, 'F');
    pdf.setDrawColor(102, 126, 234);
    pdf.rect(20, yPosition, 170, 35);
    
    pdf.setFontSize(14);
    pdf.setTextColor(102, 126, 234);
    pdf.text('European AQI Scale', 25, yPosition + 10);
    
    const legendItems = [
      { level: '1', color: [0, 228, 0], label: 'Very Good' },
      { level: '2', color: [255, 255, 0], label: 'Good' },
      { level: '3', color: [255, 126, 0], label: 'Fair' },
      { level: '4', color: [255, 0, 0], label: 'Poor' },
      { level: '5', color: [143, 63, 151], label: 'Very Poor' }
    ];
    
    legendItems.forEach((item, index) => {
      const x = 25 + (index * 32);
      // Color box
      pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
      pdf.rect(x, yPosition + 15, 12, 8, 'F');
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(x, yPosition + 15, 12, 8);
      
      // Level number
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.text(item.level, x + 5, yPosition + 20);
      
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      pdf.text(item.label, x - 2, yPosition + 28);
    });
    yPosition += 45;
    
    // Industries section
    if (industries && industries.length > 0) {
      pdf.setFontSize(12);
      pdf.setTextColor(102, 126, 234);
      pdf.text('Nearby Industries', 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      industries.slice(0, 5).forEach((industry, index) => {
        pdf.text(`• ${industry.name} (${industry.type})`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }
    
    // Recommendations
    pdf.setFontSize(12);
    pdf.setTextColor(102, 126, 234);
    pdf.text('Health & Action Recommendations', 20, yPosition);
    yPosition += 10;
    
    const recommendations = getRecommendations(airQualityData?.aqi);
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    recommendations.forEach((rec) => {
      if (yPosition < pageHeight - 25) {
        const lines = pdf.splitTextToSize(`• ${rec}`, 170);
        lines.forEach(line => {
          if (yPosition < pageHeight - 25) {
            pdf.text(line, 25, yPosition);
            yPosition += 5;
          }
        });
        yPosition += 2;
      }
    });
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    const footerText = 'Generated by Smokestack Air Quality Monitor | Data sources: OpenWeatherMap, Overpass API';
    const footerWidth = pdf.getTextWidth(footerText);
    pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 10);
    
    // Save PDF
    pdf.save(`air-quality-insights-${locationInfo?.city || 'location'}-${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  const getAQILevel = (aqi) => {
    if (!aqi) return 'Unknown';
    switch(aqi) {
      case 1: return 'Very Good';
      case 2: return 'Good';
      case 3: return 'Fair';
      case 4: return 'Poor';
      case 5: return 'Very Poor';
      default: return 'Unknown';
    }
  };
  
  const getAQIColor = (aqi) => {
    if (!aqi) return [128, 128, 128];
    switch(aqi) {
      case 1: return [0, 228, 0];
      case 2: return [255, 255, 0];
      case 3: return [255, 126, 0];
      case 4: return [255, 0, 0];
      case 5: return [143, 63, 151];
      default: return [128, 128, 128];
    }
  };
  
  const getRecommendations = (aqi) => {
    const baseRecs = [
      'Monitor air quality regularly using this tool',
      'Consider location when planning outdoor activities',
      'Support policies for cleaner industrial practices'
    ];
    
    if (!aqi) return baseRecs;
    
    if (aqi >= 4) {
      return [
        'Limit outdoor activities, especially exercise',
        'Consider air purifiers for indoor spaces',
        'Wear N95 masks when outdoors',
        ...baseRecs
      ];
    } else if (aqi >= 3) {
      return [
        'Sensitive individuals should limit outdoor exposure',
        'Avoid heavy outdoor exercise during peak hours',
        ...baseRecs
      ];
    } else {
      return [
        'Air quality is good for outdoor activities',
        'Continue monitoring for changes',
        ...baseRecs
      ];
    }
  };
  
  return (
    <button 
      onClick={generatePDF}
      className="export-btn"
      title="Export insights as PDF with map"
    >
      📄 Export PDF
    </button>
  );
};

export default InsightsExport;