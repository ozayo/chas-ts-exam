// Wonton Model
export interface Wonton {
  id: number;
  type: 'wonton';
  name: string;
  description: string;
  price: number;
  ingredients: string[];
}

// Dip Model
export interface Dip {
  id: number;
  type: 'dip';
  name: string;
  description: string;
  price: number;
}

// Drink Model
export interface Drink {
  id: number;
  type: 'drink';
  name: string;
  description: string;
  price: number;
}

// Order Model
export interface Order {
  id: string;
  items: (Wonton | Dip | Drink)[];
  orderValue: number;
  eta: number;
  timestamp: string;
  state: 'waiting' | 'processing' | 'done';
}

// Receipt Model
export interface Receipt {
  id: string;
  orderValue: number;
  timestamp: string;
  items: {
    id: number;
    name: string;
    type: 'wonton' | 'dip' | 'drink';
    quantity: number;
    price: number;
  }[];
}

// Keystring Model (for API key)
export type Keystring = string;

// OrderBody Model (for order requests)
export interface OrderBody {
  items: number[]; // Array of item IDs
}

export type MenuItem = Wonton | Dip | Drink; // Bu birleşik türü ekliyoruz