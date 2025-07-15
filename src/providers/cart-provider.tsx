"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Course } from "@/shared/course";
import { CartService } from "@/service/cart";

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getDiscount: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCart = CartService.getCart();
    setCart(savedCart);
    setIsLoading(false);
  }, []);

  const addToCart = (course: Course) => {
    const updatedCart = CartService.addToCart(course);
    setCart(updatedCart);
  };

  const removeFromCart = (courseId: string) => {
    const updatedCart = CartService.removeFromCart(courseId);
    setCart(updatedCart);
  };

  const updateQuantity = (courseId: string, quantity: number) => {
    const updatedCart = CartService.updateQuantity(courseId, quantity);
    setCart(updatedCart);
  };

  const clearCart = () => {
    CartService.clearCart();
    setCart([]);
  };

  const getTotal = () => CartService.getCartTotal(cart);
  const getDiscount = () => CartService.getCartDiscount(cart);
  const getItemCount = () => CartService.getCartItemCount(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getDiscount,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
