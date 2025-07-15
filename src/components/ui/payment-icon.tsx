import { CreditCard, Smartphone } from "lucide-react";

interface PaymentIconProps {
  type: "credit" | "debit" | "pix";
  className?: string;
}

export function PaymentIcon({ type, className = "w-5 h-5" }: PaymentIconProps) {
  switch (type) {
    case "credit":
    case "debit":
      return <CreditCard className={className} />;
    case "pix":
      return <Smartphone className={className} />;
    default:
      return <CreditCard className={className} />;
  }
}

export function PaymentMethodBadge({
  type,
}: {
  type: "credit" | "debit" | "pix";
}) {
  const getLabel = () => {
    switch (type) {
      case "credit":
        return "Crédito";
      case "debit":
        return "Débito";
      case "pix":
        return "PIX";
      default:
        return "Crédito";
    }
  };

  const getColor = () => {
    switch (type) {
      case "credit":
        return "bg-blue-100 text-blue-800";
      case "debit":
        return "bg-green-100 text-green-800";
      case "pix":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor()}`}
    >
      <PaymentIcon type={type} className="w-3 h-3 mr-1" />
      {getLabel()}
    </span>
  );
}
