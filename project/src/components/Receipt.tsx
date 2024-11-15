// project/src/components/Receipt.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReceipt } from '../api';
import { Receipt } from '../models/types'; // Receipt tipini import ediyoruz
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";

const ReceiptPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadReceipt = async () => {
      if (!orderId) return;

      try {
        const receiptData: Receipt = await fetchReceipt(orderId);
        console.log("Received receipt data:", receiptData); // Alınan veriyi kontrol
        setReceipt(receiptData); // Doğrudan receipt nesnesini kullanıyoruz
      } catch (err) {
        console.error("Error fetching receipt:", err);
        setError("Failed to load receipt details.");
      }
    };

    loadReceipt();
  }, [orderId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!receipt) {
    return <div>Loading receipt...</div>;
  }

  return (
    <div className="flex flex-col self-center justify-center screen-minus-96 gap-4 px-4 text-coal ">
      <div className="flex flex-col w-full justify-center items-center text-center bg-[#EEEEEE] pt-[32px] gap-[10px] rounded-[4px]">
        {/* <p>Order ID: {receipt.id}</p> */}
        {/* <p>Total Price: {receipt.orderValue} SEK</p> */}
        {/* <p>Order Timestamp: {new Date(receipt.timestamp).toLocaleString()}</p> */}

        <img className="max-h-[40px] max-w-[40px]" src={logo} alt="Logo" />
				<p className="flex flex-col text-[24px] leading-[33.6px] text-[#353131] tracking-wider font-bold">
					KVITTO
					<span className="text-[12px] leading-[16.8px] font-bold text-[#605858]">#{receipt.id}</span>
				</p>
        {receipt.items && receipt.items.length > 0 ? (
          <ul className="flex flex-col w-full justify-center">
            {receipt.items.map((item) => (
              <li key={item.id} className="flex flex-col w-full gap-2 p-4 border-b border-dotted border-shade-24-dark last:border-none">
                {/* <p>{item.name} ({item.quantity} stycken) - {item.price} SEK</p> */}
                <p className="flex flex-row w-full font-bold text-[16px] leading-[19.2px] uppercase">
                  <span className="w-fit">{item.name}</span>
                  <span className="flex-1 border-b-2 border-dotted border-coal"></span>
                  <span className="inline ml-auto w-fit">{item.price} SEK</span>
                </p>
                <span className="mr-auto">{item.quantity} stycken</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items available in this receipt.</p>
        )}
        <div className="flex flex-row items-center justify-between w-full h-[78px] gap-[8px] bg-[#3531313D] text-[24px] leading-[28px] font-bold p-[16px] mt-auto rounded-b-[4px]">
					<p className="flex flex-col items-start">
						<span className="text-[16px] leading-[19.2px]">TOTALT</span>
						<span className="text-[12px] leading-[14.4px] font-normal">inkl moms 20%</span>
					</p>
					{receipt.orderValue} SEK
				</div>
      </div>
      <button
				className="text-center text-wrap w-full min-h-[78px] gap-[8px] bg-coal text-undisclosed rounded-[4px] text-[24px] leading-[28.8px] font-bold px-[16px] py-[20px] mt-auto hover:cursor-pointer select-none"
				onClick={() => navigate(`/`)}>
				GÖR EN NY BESTÄLLNING
			</button>
    </div>
  );
};

export default ReceiptPage;