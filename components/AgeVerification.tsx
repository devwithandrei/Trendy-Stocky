"use client"

import React, { useEffect, useState } from 'react';

const AgeVerification = () => {
  const [script, setScript] = useState<HTMLScriptElement | null>(null);
  const [appDiv, setAppDiv] = useState<HTMLDivElement | null>(null);

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

      // Set state after appending elements to the body
      setScript(newScript);
      setAppDiv(newAppDiv);
    }

    return () => {
      if (body && script && appDiv) {
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