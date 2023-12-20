"use client"
import React, { useEffect } from 'react';

const AgeVerification = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.commoninja.com/sdk/latest/commonninja.js';
    script.defer = true;

    const appDiv = document.createElement('div');
    appDiv.className = 'commonninja_component pid-72aadd2b-e504-4bad-9c32-018e363bfe92';

    const body = document.querySelector('body');
    if (body) {
      body.appendChild(script);
      body.appendChild(appDiv);
    }

    return () => {
      if (body) {
        body.removeChild(script);
        body.removeChild(appDiv);
      }
    };
  }, []);

  return (
    <div className="commonninja_component pid-72aadd2b-e504-4bad-9c32-018e363bfe92"></div>
  );
};

export default AgeVerification;
