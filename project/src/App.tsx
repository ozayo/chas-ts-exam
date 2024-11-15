// src/App.tsx

import React, { useEffect, useState } from 'react';
import Menu from './components/Menu';
import Cart from './components/Cart';
import OrderResult from './components/OrderResult';
import Receipt from './components/Receipt';
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchApiKey } from './api';
import Layout from "./Layout";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApi = async () => {
      try {
        await fetchApiKey();
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize API key:", error);
        setError("Failed to initialize application. Please try again later.");
      }
    };

    initializeApi();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-result" element={<OrderResult />} />
            <Route path="/receipt/:orderId" element={<Receipt />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
