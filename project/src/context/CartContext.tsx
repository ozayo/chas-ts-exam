// project/src/context/CartContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '../models/types';

// Sepet durumunu ve ekleme/çıkarma işlemlerini tanımlıyoruz
type CartContextType = {
  cartItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// CartContext'i kullanmak için yardımcı bir hook oluşturuyoruz
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
