import React from 'react';

const MapComponent = () => {
  return (
    <div className="map-container" style={{ width: '100%', height: '300px', overflow: 'hidden', position: 'relative' }}>
      <iframe
        title="Google Map"
        width="100%"
        height="100%"
        loading="lazy"
        allowFullScreen
        frameBorder="0"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387248.42592070794!2d4.895168!3d52.370216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c14d38631d%3A0xbed6226c5c71cc6!2sAmsterdam%2C%20Netherlands!5e0!3m2!1sen!2sus!4v1629786816796!5m2!1sen!2sus"
        style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
      ></iframe>
    </div>
  );
};

export default MapComponent;
