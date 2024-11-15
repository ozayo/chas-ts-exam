import { Order, Receipt } from './models/types';

const BASE_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

// API key'i bir kez alıp saklamak için bir değişken
let apiKey: string | null = null;

/**
 * Fetches API key only if it has not been set previously.
 */
export async function fetchApiKey(): Promise<void> {
  if (apiKey) {
    console.log("API key already set.");
    return;
  }

  const response = await fetch(`${BASE_URL}/keys`, {
    method: "POST",
  });

  if (response.ok) {
    const data = await response.json();
    apiKey = data.key;
    console.log("API key fetched:", apiKey);
  } else {
    throw new Error("Failed to fetch API key");
  }
}

/**
 * Fetches menu items.
 */
export async function fetchMenu(type?: string) {
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  const url = type ? `${BASE_URL}/menu?type=${type}` : `${BASE_URL}/menu`;
  const response = await fetch(url, {
    headers: {
      "x-zocom": apiKey,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data.items;
  } else {
    throw new Error("Failed to fetch menu items");
  }
}

/**
 * Submits an order with the provided items
 */
export async function submitOrder(items: number[]): Promise<Order> {
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  const response = await fetch(`${BASE_URL}/ozaytruck/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-zocom": apiKey,
    },
    body: JSON.stringify({ items }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('submitOrder response data:', data); // Gelen veriyi kontrol etmek için
    return data.order; // Sadece order nesnesini döndürüyoruz
  } else {
    throw new Error("Failed to submit order");
  }
}

/**
 * Fetches a receipt using the order ID
 */
export async function fetchReceipt(orderId: string): Promise<Receipt> {
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  const response = await fetch(`${BASE_URL}/receipts/${orderId}`, {
    headers: {
      "x-zocom": apiKey,
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log('fetchReceipt response data:', data); // Gelen veriyi kontrol etmek için
    return data.receipt; // Sadece receipt nesnesini döndürüyoruz
  } else {
    throw new Error("Failed to fetch receipt");
  }
}

/**
 * Fetches an order using the order ID
 */
export async function fetchOrder(orderId: string): Promise<Order> {
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    headers: {
      "x-zocom": apiKey,
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log('fetchOrder response data:', data); // Gelen veriyi kontrol etmek için
    return data.order; // Sadece order nesnesini döndürüyoruz
  } else {
    throw new Error("Failed to fetch order");
  }
}
