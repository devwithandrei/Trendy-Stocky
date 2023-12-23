"use client"
import { useEffect } from 'react';

const CrispChatScript = () => {
  useEffect(() => {
    const crispScript = `
      window.$crisp=[];
      window.CRISP_WEBSITE_ID="9a4c5290-d74b-4f6b-aeda-a41520f3a883";
      (function(){d=document;s=d.createElement("script");
      s.src="https://client.crisp.chat/l.js";
      s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
    `;

    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.innerHTML = crispScript;

    document.head.appendChild(scriptTag);

    return () => {
      // Clean up the script when the component unmounts (optional)
      document.head.removeChild(scriptTag);
    };
  }, []);

  return null;
};

export default CrispChatScript;
