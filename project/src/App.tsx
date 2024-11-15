import React, { useEffect, useState } from 'react';
import Menu from './components/Menu';
import Cart from './components/Cart';
import OrderResult from './components/OrderResult';
import Receipt from './components/Receipt';
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchApiKey } from './api';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApi = async () => {
      try {
        await fetchApiKey();
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize API key:", error);
      }
    };

    initializeApi();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-result" element={<OrderResult />} />
          <Route path="/receipt/:orderId" element={<Receipt />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
