"use client";
import { CartProvider } from "@/providers/cart-provider";
import CoursesDemo from "@/components/pages/courses-demo";

export default function CoursesPage() {
  return (
    <div>
      <CartProvider>
        <CoursesDemo />
      </CartProvider>
    </div>
  );
}
