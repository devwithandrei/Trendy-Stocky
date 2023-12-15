"use client"
import { useEffect } from 'react';

const CrispChatScript = () => {
  useEffect(() => {
    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = "9a4c5290-d74b-4f6b-aeda-a41520f3a883";

    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true; // Set async as a boolean
    d.getElementsByTagName("head")[0].appendChild(s);

    return () => {
      // Clean up the script when the component unmounts (optional)
      const scriptElement = d.getElementById('crisp-chat-script');
      scriptElement?.parentNode?.removeChild(scriptElement);
    };
  }, []);

  return null;
};

export default CrispChatScript;
