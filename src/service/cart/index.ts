import { Course, CartItem } from "@/shared/course";

export class CartService {
  private static STORAGE_KEY = "learnfy_cart";

  static getCart(): CartItem[] {
    if (typeof window === "undefined") return [];

    try {
      const cart = localStorage.getItem(this.STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Error getting cart from localStorage:", error);
      return [];
    }
  }

  static saveCart(cart: CartItem[]): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }

  static addToCart(course: Course): CartItem[] {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.course.id === course.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ course, quantity: 1 });
    }

    this.saveCart(cart);
    return cart;
  }

  static removeFromCart(courseId: string): CartItem[] {
    const cart = this.getCart();
    const updatedCart = cart.filter((item) => item.course.id !== courseId);
    this.saveCart(updatedCart);
    return updatedCart;
  }

  static updateQuantity(courseId: string, quantity: number): CartItem[] {
    const cart = this.getCart();
    const item = cart.find((item) => item.course.id === courseId);

    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(courseId);
      }
      item.quantity = quantity;
      this.saveCart(cart);
    }

    return cart;
  }

  static clearCart(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getCartTotal(cart: CartItem[]): number {
    return cart.reduce(
      (total, item) => total + item.course.price * item.quantity,
      0
    );
  }

  static getCartDiscount(cart: CartItem[]): number {
    return cart.reduce((total, item) => {
      const discount = item.course.originalPrice
        ? (item.course.originalPrice - item.course.price) * item.quantity
        : 0;
      return total + discount;
    }, 0);
  }

  static getCartItemCount(cart: CartItem[]): number {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
}
