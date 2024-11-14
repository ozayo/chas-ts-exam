// project/src/components/Menu.tsx

import React, { useEffect, useState } from 'react';
import { fetchMenu } from '../api';
import { Wonton, Dip, Drink } from '../models/types';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

type MenuItem = Wonton | Dip | Drink;

const Menu: React.FC = () => {
  const { cartItems, addToCart, removeFromCart } = useCart(); // Ürün ekleme ve çıkarma fonksiyonları
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // Seçilen ürünlerin ID'leri
  const navigate = useNavigate(); // Sayfa yönlendirme için kullanıyoruz

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        const items = await fetchMenu();
        setMenuItems(items);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const toggleSelectItem = (item: MenuItem) => {
    if (selectedItems.includes(item.id)) {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((id) => id !== item.id)
      );
      removeFromCart(item.id); // Ürün seçiliyse sepetten çıkar
    } else {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item.id]);
      addToCart(item); // Ürün seçili değilse sepete ekle
    }
  };

  const wontonItems = menuItems.filter((item) => item.type === 'wonton');
  const dipItems = menuItems.filter((item) => item.type === 'dip');
  const drinkItems = menuItems.filter((item) => item.type === 'drink');

  if (loading) {
    return <div>Loading menu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Sepet İkonu */}
      <div className="cart-icon" onClick={() => navigate('/cart')}>
        <span>🛒</span>
        {cartItems.length > 0 && (
          <span className="cart-count">{cartItems.length}</span>
        )}
      </div>

      <h1>Menu</h1>

      {/* Wonton (Ana Yemekler) Bölümü */}
      <section>
        <h2>Wonton (Ana Yemekler)</h2>
        <ul>
          {wontonItems.map((item) => (
            <li
              key={item.id}
              onClick={() => toggleSelectItem(item)}
              className={selectedItems.includes(item.id) ? 'selected' : ''} 
            >
              <h3>{item.name} ....................... {item.price} SEK</h3>
              <p>{item.ingredients.join(', ')}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Dip (Soslar) Bölümü */}
      <section>
        <h2>DIPSÅS ............ 19 SEK</h2>
        <div className="dip-container">
          {dipItems.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleSelectItem(item)}
              className={`item-header ${selectedItems.includes(item.id) ? 'selected' : ''}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

      {/* Drink (İçecekler) Bölümü */}
      <section>
        <h2>DRICKA ............ 19 SEK</h2>
        <div className="drink-container">
          {drinkItems.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleSelectItem(item)}
              className={`item-header ${selectedItems.includes(item.id) ? 'selected' : ''}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Menu;
