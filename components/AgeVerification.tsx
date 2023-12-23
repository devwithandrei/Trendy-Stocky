"use client"

import React, { useEffect, useRef } from 'react';

const AgeVerification = () => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const appDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newScript = document.createElement('script');
    newScript.src = 'https://cdn.commoninja.com/sdk/latest/commonninja.js';
    newScript.defer = true;

    const newAppDiv = document.createElement('div');
    newAppDiv.className = 'commonninja_component pid-72aadd2b-e504-4bad-9c32-018e363bfe92';

    const body = document.querySelector('body');
    if (body) {
      body.appendChild(newScript);
      body.appendChild(newAppDiv);

      // Update the ref values after appending elements to the body
      scriptRef.current = newScript;
      appDivRef.current = newAppDiv;
    }

    return () => {
      if (body && scriptRef.current && appDivRef.current) {
        body.removeChild(scriptRef.current);
        body.removeChild(appDivRef.current);
      }
    };
  }, []); 

  return (
    <div className="commonninja_component pid-72aadd2b-e504-4bad-9c32-018e363bfe92"></div>
  );
};

export default AgeVerification;
