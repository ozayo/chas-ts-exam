// project/src/components/Menu.tsx

import React, { useEffect, useState } from 'react';
import { fetchMenu } from '../api';
import { Wonton, Dip, Drink } from '../models/types';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import cartIcon from "../assets/cart.svg";

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
    <div className='mainpage'>
      
      {/* Sepet İkonu */}
      <div className='fixed right-0 top-0 h-[80px] max-h-[80px]'>
        <div className="relative w-[75px] h-[75px] mt-[5px] mr-[5px] ml-auto hover:cursor-pointer" onClick={() => navigate('/cart')}>
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

      
      <div className='flex flex-col gap-4 px-4 text-snow'>
        <h1 className="font-bold text-[32px] leading-[16px]">MENY</h1>
        {/* Wonton (Ana Yemekler) Bölümü */}
        <section className='bg-clay rounded-lg '>
          <ul>
            {wontonItems.map((item) => (
              <li
                  key={item.id}
                  onClick={() => toggleSelectItem(item)}
                  className={`flex flex-col w-full gap-2 p-4 border-b border-dotted border-shade-24-light first:rounded-t-lg last:rounded-b-lg last:border-none hover:cursor-pointer ${
                    selectedItems.includes(item.id) ? 'bg-coal' : ''
                  }`}
              >
                <div className='flex flex-row w-full font-bold text-[22px] leading-[26.4px] uppercase'>
                  <h2 className='w-fit'>{item.name}</h2>
                  <span className='flex-1 border-b-2 border-dotted mb-[6px] mx-2'></span>
                  <span className='inline ml-auto w-fit'>{item.price} SEK</span>
                </div>
                <p className='font-medium text-[14px] leading-[16.8px]'>{item.ingredients.join(', ')}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Dip (Soslar) Bölümü */}
        <section className='bg-clay rounded-lg p-4'>
          <div className='flex flex-row w-full font-bold text-[22px] leading-[26.4px] uppercase'>
            <h2>DIPSÅS</h2>
            <span className='flex-1 border-b-2 border-dotted mb-[6px] mx-2'></span>
            <span className='inline ml-auto w-fit'>19 SEK</span>
          </div>
          <div className="flex flex-wrap w-full gap-4 mt-6">
            {dipItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleSelectItem(item)}
                // className={`item-header ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                className={`w-fit h-fit py-2 px-3 rounded-[4px] text-[14px] leading-[16.8px] hover:cursor-pointer ${selectedItems.includes(item.id) ? 'bg-coal' : 'bg-shade-24-light'}`}>
                {item.name}
              </button>
            ))}
          </div>
        </section>

        {/* Drink (İçecekler) Bölümü */}
        <section className='bg-clay rounded-lg p-4'>
          <div className='flex flex-row w-full font-bold text-[22px] leading-[26.4px] uppercase'>
            <h2>Dricka</h2>
            <span className='flex-1 border-b-2 border-dotted mb-[6px] mx-2'></span>
            <span className='inline ml-auto w-fit'>19 SEK</span>
          </div>
          <div className="flex flex-wrap w-full gap-4 mt-6">
            {drinkItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleSelectItem(item)}
                className={`w-fit h-fit py-2 px-3 rounded-[4px] text-[14px] leading-[16.8px] hover:cursor-pointer ${selectedItems.includes(item.id) ? 'bg-coal' : 'bg-shade-24-light'}`}>
                {item.name}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Menu;
