// project/src/components/OrderResult.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Order } from '../models/types'; // Order tipini içe aktarıyoruz

const OrderResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  useEffect(() => {
    if (location.state) {
      const { orderId, orderValue, eta, timestamp } = location.state as {
        orderId: string;
        orderValue: number;
        eta: string;
        timestamp: string;
      };

      // Order tipiyle uyumlu hale getiriyoruz
      const orderData: Order = {
        id: orderId,
        items: [], // items içeriğini burada gerekliyse doldurun
        orderValue,
        eta: new Date(eta).getTime(),
        timestamp,
        state: 'waiting', // Örnek bir durum
      };

      setOrderDetails(orderData);
      console.log("Order details structured for Order type:", orderData);
    } else {
      console.error("Order details not found in location state.");
      alert("Order details could not be found.");
    }
  }, [location.state]);

  if (!orderDetails) {
    return <div>Loading order details...</div>;
  }

  // ETA'yı dakikalar olarak hesaplama
  const etaDate = new Date(orderDetails.eta);
  const orderDate = new Date(orderDetails.timestamp);
  const etaMinutes = Math.round((etaDate.getTime() - orderDate.getTime()) / 60000);

  // Okunabilir tarih ve saat formatında gösterim
  const formattedETA = `${etaDate.toLocaleDateString()} ${etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div>
      <h2>Order Confirmation</h2>
      <p>Order ID: {orderDetails.id}</p>
      <p>Total Price: {orderDetails.orderValue} SEK</p>
      <p>Estimated Time of Arrival: {formattedETA}</p>
      <p>ETA: {etaMinutes} MIN</p>
      <p>Timestamp: {new Date(orderDetails.timestamp).toLocaleString()}</p>
      <button onClick={() => navigate(`/receipt/${orderDetails.id}`)}>SE KVITTO</button>
    </div>
  );
};

export default OrderResult;
