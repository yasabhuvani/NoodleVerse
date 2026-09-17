import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { cartService } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  minimalPackaging: boolean;
  setMinimalPackaging: (val: boolean) => void;
  hasEcoItems: boolean;
  addToCart: (product: Product, quantity?: number, customDetails?: CartItem['customDetails']) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [minimalPackaging, setMinimalPackaging] = useState<boolean>(false);

  useEffect(() => {
    const stored = cartService.getCart();
    setCart(stored);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const hasEcoItems = cart.some(
    (item) => item.product.dietType === 'VEGETARIAN' || item.product.dietType === 'VEGAN'
  );

  const addToCart = async (
    product: Product,
    quantity: number = 1,
    customDetails?: CartItem['customDetails']
  ) => {
    const updated = await cartService.addToCart(product, quantity, customDetails);
    setCart([...updated]);
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    const updated = await cartService.updateQuantity(cartItemId, quantity);
    setCart([...updated]);
  };

  const removeFromCart = async (cartItemId: string) => {
    const updated = await cartService.removeFromCart(cartItemId);
    setCart([...updated]);
  };

  const clearCart = () => {
    cartService.clearCart();
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        minimalPackaging,
        setMinimalPackaging,
        hasEcoItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
