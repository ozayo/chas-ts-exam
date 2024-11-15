// project/src/components/Receipt.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReceipt } from '../api';
import { Receipt } from '../models/types'; // Receipt tipini import ediyoruz

const ReceiptPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div>
      <h2>Receipt</h2>
      <p>Order ID: {receipt.id}</p>
      <p>Total Price: {receipt.orderValue} SEK</p>
      <p>Order Timestamp: {new Date(receipt.timestamp).toLocaleString()}</p>
      <h3>Items:</h3>
      {receipt.items && receipt.items.length > 0 ? (
        <ul>
          {receipt.items.map((item) => (
            <li key={item.id}>
              <p>{item.name} ({item.quantity} stycken) - {item.price} SEK</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items available in this receipt.</p>
      )}
    </div>
  );
};

export default ReceiptPage;