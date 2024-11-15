// project/src/components/Cart.tsx

import React from 'react';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../api';
import { useNavigate } from 'react-router-dom';
import { Order } from '../models/types'; // Order tipini import ediyoruz

const Cart: React.FC = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const itemCounts = cartItems.reduce<{ [id: number]: number }>((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {});

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleOrder = async () => {
    try {
      const itemIds = cartItems.map((item) => item.id);
      const orderResult: Order = await submitOrder(itemIds);

      if (orderResult && orderResult.id && orderResult.orderValue && orderResult.eta && orderResult.timestamp) {
        navigate('/order-result', {
          state: {
            orderId: orderResult.id,
            orderValue: orderResult.orderValue,
            eta: orderResult.eta,
            timestamp: orderResult.timestamp,
          },
        });
      } else {
        console.error("Incomplete order result from API:", orderResult);
        alert("There was an issue with the order details received from the server.");
      }
    } catch (error) {
      console.error("Failed to submit order:", error);
      alert("There was an error processing your order.");
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {Object.keys(itemCounts).map((id) => {
            const itemId = Number(id);
            const item = cartItems.find((cartItem) => cartItem.id === itemId);
            if (!item) return null;

            return (
              <li key={itemId}>
                <span>{item.name} ....................... {itemCounts[itemId] * item.price} SEK</span>
                <div>
                  <button onClick={() => removeFromCart(itemId)}>-</button>
                  <span>{itemCounts[itemId]} stycken</span>
                  <button onClick={() => addToCart(item)}>+</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <h3>TOTALT {totalPrice} SEK</h3>
      <button onClick={handleOrder}>Take my money!</button>
    </div>
  );
};

export default Cart;