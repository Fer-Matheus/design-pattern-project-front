import { CartProvider } from "@/providers/cart-provider";
import CheckoutPageContent from "@/components/pages/checkout-page";

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutPageContent />
    </CartProvider>
  );
}
