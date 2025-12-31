'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  id: string; // Internal DB ID
  code: string; // MO-101
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (pet: any) => void;
  removeFromCart: (petId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. Load Cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('monito_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 2. Save Cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('monito_cart', JSON.stringify(cart));
  }, [cart]);

  // Actions
  const addToCart = (pet: any) => {
    // Check if already in cart
    if (cart.find((item) => item.id === pet.id)) {
      alert("This pet is already in your cart!");
      return;
    }
    
    const newItem: CartItem = {
      id: pet.id,
      code: pet.code,
      name: pet.name,
      price: typeof pet.price === 'string' ? parseInt(pet.price) : pet.price,
      imageUrl: pet.imageUrl,
      category: pet.category
    };

    setCart([...cart, newItem]);
    alert(`${pet.name} added to cart!`);
  };

  const removeFromCart = (petId: string) => {
    setCart(cart.filter((item) => item.id !== petId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount: cart.length }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}