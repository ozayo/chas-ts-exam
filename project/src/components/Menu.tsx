// project/src/components/Menu.tsx

import React, { useEffect, useState } from 'react';
import { fetchMenu } from '../api';
import { Wonton, Dip, Drink } from '../models/types';

type MenuItem = Wonton | Dip | Drink;

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true); // Yükleme başlıyor
        const items = await fetchMenu();
        console.log("Fetched menu items:", items);  // Burada items kontrol edilebilir
        setMenuItems(Array.isArray(items) ? items : []);  // Dizi değilse boş dizi olarak ayarlıyoruz
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load menu items");
      } finally {
        setLoading(false); // Yükleme tamamlandı
      }
    };

    loadMenu();
  }, []);

  // Veriyi render etmeden hemen önce kontrol ediyoruz
  console.log("Menu items to display:", menuItems);

  if (loading) {
    return <div>Loading menu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <li key={item.id}>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>Price: {item.price} SEK</p>
            </li>
          ))
        ) : (
          <p>No menu items available.</p> // Eğer `menuItems` boşsa kullanıcıya gösterilecek mesaj
        )}
      </ul>
    </div>
  );
};

export default Menu;
