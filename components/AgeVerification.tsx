"use client"
import React, { useEffect } from 'react';

const AgeVerification = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.setAttribute('data-use-service-core', '');
    script.defer = true;

    const appDiv = document.createElement('div');
    appDiv.className = 'elfsight-app-9b4f752e-bf38-4903-90f1-7d7b49239331';
    appDiv.setAttribute('data-elfsight-app-lazy', '');

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

  return null;
};

export default AgeVerification;