"use client";
import { CartProvider } from "@/providers/cart-provider";
import CoursesDemo from "@/components/pages/courses-demo";
import NavbarComponent from "@/components/base/navbar";

export default function CoursesPage() {
  return (
    <div>
      <CartProvider>
        <CoursesDemo />
      </CartProvider>
    </div>
  );
}
