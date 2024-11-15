// project/src/components/OrderResult.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Order } from '../models/types'; // Order tipini içe aktarıyoruz
import boxtop from "../assets/boxtop.png";

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
  // const formattedETA = `${etaDate.toLocaleDateString()} ${etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="flex flex-col screen-minus-96 w-full gap-4 px-4 text-coal">
      <img className="flex self-center" src={boxtop} />
      <div className="flex flex-col text-center self-center items-center justify-center w-[326px] text-snow gap-[16px]">
				<p className="flex-wrap w-full text-[32px] leading-[38.4px] font-bold">DINA WONTONS TILLAGAS!</p>
        <p className="text-[26px] leading-[31.2px] font-medium">ETA: {etaMinutes} MIN</p>
        {/* <p>Estimated Time of Arrival: {formattedETA}</p> */}
        <p className="text-[15px] leading-[18px] font-medium">#{orderDetails.id}</p>
        {/* <p>Timestamp: {new Date(orderDetails.timestamp).toLocaleString()}</p> */}
        {/* <p>Total Price: {orderDetails.orderValue} SEK</p> */}
      </div>
      
			<button
				className="text-center font-bold w-full h-[78px] gap-[8px] bg-shade-24-dark rounded-[4px] text-[24px] leading-[28.8px] border-2 border-undisclosed/80 text-undisclosed/80 px-[16px] py-[20px] mt-auto hover:cursor-pointer select-none"
				onClick={() => navigate(`/receipt/${orderDetails.id}`)}>
				SE KVITTO
			</button>
			<button
				className="text-center text-wrap w-full min-h-[78px] gap-[8px] bg-coal text-undisclosed rounded-[4px] text-[24px] leading-[28.8px] font-bold px-[16px] py-[20px] hover:cursor-pointer select-none"
				onClick={() => navigate(`/`)}>
				GÖR EN NY BESTÄLLNING
			</button>      
    </div>
  );
};

export default OrderResult;
