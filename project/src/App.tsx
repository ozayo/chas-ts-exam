// project/src/App.tsx

import React, { useEffect } from 'react';
import Menu from './components/Menu';
import { fetchApiKey, registerTenant } from './api';

const App: React.FC = () => {
  useEffect(() => {
    const initializeApi = async () => {
      try {
        await fetchApiKey();
        await registerTenant();
        console.log("API key and tenant ID are set.");
      } catch (err) {
        console.error("Failed to initialize API key and tenant:", err);
      }
    };

    initializeApi();
  }, []);

  return (
    <div>
      <Menu />
    </div>
  );
};

export default App;
