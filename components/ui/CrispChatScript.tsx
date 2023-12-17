"use client"
import { useEffect } from 'react';

const CrispChatScript = () => {
  useEffect(() => {
    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = "c5bc8c29-0aaf-4efa-805c-197da6e270e2";

    const d = document;
    const s = d.createElement("script");
    s.id = 'crisp-chat-script'; // Set an ID for the script tag
    s.type = 'text/javascript';
    s.innerHTML = `window.$crisp=[];window.CRISP_WEBSITE_ID="${(window as any).CRISP_WEBSITE_ID}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`;

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
