// project/src/api/api.ts

const BASE_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

let apiKey: string | null = localStorage.getItem("apiKey");
let tenantId: string | null = localStorage.getItem("tenantId");

/**
 * Fetches API key if not already set and saves it in localStorage.
 */
export async function fetchApiKey(): Promise<void> {
  if (apiKey) {
    console.log("Using existing API key from localStorage.");
    return;
  }

  const response = await fetch(`${BASE_URL}/keys`, {
    method: "POST",
  });

  if (response.ok) {
    apiKey = await response.json();
    if (apiKey) {
      localStorage.setItem("apiKey", apiKey);
      console.log("API key fetched and saved to localStorage.");
    }
  } else {
    throw new Error("Failed to fetch API key");
  }
}

/**
 * Registers a tenant with a fixed name and saves tenant ID in localStorage.
 */
export async function registerTenant(): Promise<void> {
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  if (tenantId) {
    console.log("Using existing tenant ID from localStorage.");
    return;
  }

  const tenantName = "ozaytruck"; // Sabit tenant ismi

  const response = await fetch(`${BASE_URL}/tenants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-zocom": apiKey as string, // apiKey'in string olduğundan emin oluyoruz
    },
    body: JSON.stringify({ name: tenantName }),
  });

  if (response.ok) {
    const data = await response.json();
    tenantId = data.id;
    if (tenantId) {
      localStorage.setItem("tenantId", tenantId);
      console.log("Tenant registered and saved to localStorage.");
    }
  } else {
    const errorText = await response.text();
    console.error("Failed to register tenant:", errorText);
    throw new Error("Failed to register tenant");
  }
}

/**
 * Fetches the menu items using the saved API key and tenant ID.
 */
export async function fetchMenu(type?: string) {
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  const url = type ? `${BASE_URL}/menu?type=${type}` : `${BASE_URL}/menu`;
  const response = await fetch(url, {
    headers: {
      "x-zocom": apiKey as string,
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Menu data fetched:", data); // Gelen veriyi kontrol etmek için
    return data.items; // Burada sadece items dizisini döndürüyoruz
  } else {
    throw new Error("Failed to fetch menu items");
  }
}

/**
 * Siparişi gönderir ve yanıt olarak sipariş detaylarını alır
 */
export async function submitOrder(items: number[]) {
  if (!apiKey || !tenantId) {
    throw new Error("API key or tenant ID is not set");
  }

  const response = await fetch(`${BASE_URL}/${tenantId}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-zocom": apiKey,
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit order");
  }

  const data = await response.json();
  console.log("Order result from API:", data); // Dönen veriyi kontrol ediyoruz
  return data;
}


/**
 * Kvitto icin orderid kullanarak makbuz detayini cekelim.
 */

export async function fetchReceipt(orderId: string) {
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  const response = await fetch(`${BASE_URL}/receipts/${orderId}`, {
    headers: {
      "x-zocom": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch receipt");
  }

  return await response.json();
}

