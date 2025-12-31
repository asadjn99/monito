"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast"; 
import { useRouter } from "next/navigation"; 
import { FiShoppingBag, FiAlertCircle, FiTrash2 } from "react-icons/fi"; 
// Define types
type CartItem = {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
  image?: string;
  quantity?: number;
  [key: string]: any;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter(); 

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("monito_cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("monito_cart", JSON.stringify(cart));
  }, [cart]);

  // --- ADD TO CART ---
  const addToCart = (item: CartItem) => {
    // 1. Check if item already exists
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      // 🔶 DUPLICATE WARNING (Card Style)
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                   <FiAlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-gray-900">Already Added</p>
                <p className="mt-1 text-sm text-gray-500">This pet is already in your cart.</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                router.push('/checkout');
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-bold text-blue-900 hover:text-blue-700 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              View Cart
            </button>
          </div>
        </div>
      ));
      return;
    }

    // 2. Add to State
    setCart([...cart, { ...item, quantity: 1 }]);

    // 3. ✅ SUCCESS POPUP (Card Style)
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <FiShoppingBag className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-gray-900">Added to Cart!</p>
              <p className="mt-1 text-sm text-gray-500">
                {item.name} is now in your bag.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              router.push('/checkout');
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-bold text-blue-900 hover:text-blue-700 hover:bg-gray-50 focus:outline-none transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  // --- REMOVE FROM CART ---
  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
    
    // 🔴 REMOVE NOTIFICATION (Card Style)
    toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                   <FiTrash2 className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-gray-900">Item Removed</p>
                <p className="mt-1 text-sm text-gray-500">Pet removed from cart.</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 3000 });
  };

  // --- CLEAR CART ---
  const clearCart = () => {
    setCart([]);
  };

  // Calculate Total
  const cartTotal = cart.reduce((total, item) => total + Number(item.price), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};