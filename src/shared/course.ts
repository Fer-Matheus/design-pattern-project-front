export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  instructor: string;
  duration: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  image: string;
  rating: number;
  studentsCount: number;
  category: string;
}

export interface CartItem {
  course: Course;
  quantity: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "credit" | "debit" | "pix";
  icon: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  pixKey?: string;
}

export interface CheckoutData {
  items: CartItem[];
  paymentInfo: PaymentInfo;
  total: number;
  discount: number;
  finalTotal: number;
}

export type CourseServer = {
  id: number;
  title: string;
  price: number;
  is_active: boolean;
  students_enrolled: number;
};
