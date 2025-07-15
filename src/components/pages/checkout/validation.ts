import { z } from "zod";

export const checkoutSchema = z
  .object({
    paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    pixKey: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "pix") {
        return true; // PIX não precisa de dados adicionais
      }

      // Para cartão de crédito/débito, todos os campos são obrigatórios
      if (data.paymentMethod === "credit" || data.paymentMethod === "debit") {
        return (
          data.cardNumber &&
          data.cardName &&
          data.cardExpiry &&
          data.cardCvv &&
          data.cardNumber.length >= 16 &&
          data.cardName.length >= 2 &&
          data.cardExpiry.length >= 5 &&
          data.cardCvv.length >= 3
        );
      }

      return true;
    },
    {
      message: "Dados do cartão são obrigatórios para pagamento com cartão",
    }
  );

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Utilitários para formatação
export const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = cleaned.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return match;
  }
};

export const formatCardExpiry = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/(\d{0,2})(\d{0,2})/);

  if (match) {
    const month = match[1];
    const year = match[2];

    if (month.length === 2 && year.length > 0) {
      return `${month}/${year}`;
    } else if (month.length > 0) {
      return month;
    }
  }

  return cleaned;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const validateCardNumber = (cardNumber: string) => {
  const cleaned = cardNumber.replace(/\s+/g, "");
  return cleaned.length >= 16 && cleaned.length <= 19;
};

export const validateCardExpiry = (expiry: string) => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (month < 1 || month > 12) return false;
  if (year < currentYear || (year === currentYear && month < currentMonth))
    return false;

  return true;
};

export const validateCvv = (cvv: string) => {
  return cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
};
