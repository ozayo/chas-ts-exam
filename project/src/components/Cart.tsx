// project/src/components/Cart.tsx

import React from 'react';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../api';
import { useNavigate } from 'react-router-dom';
import { Order } from '../models/types'; // Order tipini import ediyoruz
import cartIcon from "../assets/cart.svg"
import plus from "../assets/plus.svg"
import minus from "../assets/minus.svg";

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

      {/* Sepet İkonu */}
      <div className='fixed right-0 top-0 h-[80px] max-h-[80px]'>
        <div className="relative w-[75px] h-[75px] mt-[5px] mr-[5px] ml-auto hover:cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center justify-center absolute bottom-0 w-[64px] h-[64px] rounded-[4px] bg-snow">
					  <img height="32px" width="32px" src={cartIcon}></img>
          </div>
        </div>
        {cartItems.length > 0 && (
          <div className="absolute flex items-center justify-center top-[5px] right-[5px] w-[24px] h-[24px] rounded-full bg-alert">
            <span className="font-bold text-[10px] text-snow">{cartItems.length}</span>
          </div>
        )}
      </div>

      <div className='flex flex-col screen-minus-96 w-full gap-4 px-4 text-coal'>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="rounded-lg">
            {Object.keys(itemCounts).map((id) => {
              const itemId = Number(id);
              const item = cartItems.find((cartItem) => cartItem.id === itemId);
              if (!item) return null;

              return (
                <li className='flex flex-col w-full gap-2 p-4 border-b border-dotted border-shade-24-dark last:border-none' key={itemId}>
                  <div className='flex flex-row w-full font-bold text-[22px] leading-[26.4px] uppercase'>
                    <span className="w-fit">{item.name}</span>
				            <span className="flex-1 border-b-2 border-dotted border-coal"></span>
				            <span className="inline ml-auto w-fit">{itemCounts[itemId] * item.price} SEK</span>
                  </div>

                  <div className="flex flex-row gap-[10px] items-center min-w-[128px] min-h-[32px] text-[14px] leading-[15.4px] font-medium">
                    <button className='flex items-center justify-center h-[24px] w-[24px] rounded-full bg-shade-24-dark' onClick={() => removeFromCart(itemId)}>
                      <img src={minus} />
                    </button>
                    <span>{itemCounts[itemId]} stycken</span>
                    <button className='flex items-center justify-center h-[24px] w-[24px] rounded-full bg-shade-24-dark' onClick={() => addToCart(item)}>
                      <img src={plus} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className='flex flex-row items-center justify-between w-full h-[78px] gap-[8px] bg-shade-24-dark rounded-[4px] text-[32px] leading-[38.4px] font-bold px-[16px] py-[20px] mt-auto'>
            <p className="flex flex-col items-start">
            <span className="text-[22px] leading-[26.4px]">TOTALT</span>
            <span className="text-[14px] leading-[16.8px] font-medium">inkl moms 20%</span>
            </p>
          {totalPrice} SEK
        </div>
        <button className="flex flex-row items-center justify-center w-full h-[78px] gap-[8px] bg-coal text-snow rounded-[4px] text-[24px] leading-[28.8px] font-bold px-[16px] py-[20px] hover:cursor-pointer select-none uppercase" onClick={handleOrder}>Take my money!</button>
      </div>
    </div>
  );
};

export default Cart;