// project/src/App.tsx

import React from 'react';
import Menu from './components/Menu';
import Cart from './components/Cart';
import OrderResult from './components/OrderResult';
import Receipt from './components/Receipt';
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
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
