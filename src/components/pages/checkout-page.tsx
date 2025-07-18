"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Smartphone,
  ShoppingCart,
  Star,
  Clock,
  Users,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { Course, CartItem, PaymentMethod, CheckoutData } from "@/shared/course";
import { useCart } from "@/providers/cart-provider";
import {
  formatCardNumber,
  formatCardExpiry,
  formatCurrency,
  validateCardNumber,
  validateCardExpiry,
  validateCvv,
} from "@/components/pages/checkout/validation";
import { mockCourses } from "@/shared/mock-courses";
import { PaymentIcon, PaymentMethodBadge } from "@/components/ui/payment-icon";
import { getTokenFromCookies } from "@/lib/getToken";
import { buyCourse } from "@/service/auth";

// Mock data para demonstração
const paymentMethods: PaymentMethod[] = [
  {
    id: "credit",
    name: "Cartão de Crédito",
    type: "credit",
    icon: "💳",
  },
  {
    id: "debit",
    name: "Cartão de Débito",
    type: "debit",
    icon: "💳",
  },
  {
    id: "pix",
    name: "PIX",
    type: "pix",
    icon: "📱",
  },
];

export default function CheckoutPageContent() {
  const {
    cart,
    removeFromCart: removeFromCartHook,
    getTotal,
    getDiscount,
    isLoading,
    addToCart,
  } = useCart();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    pixKey: "",
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Adicionar alguns cursos ao carrinho se estiver vazio (para demonstração)
  useEffect(() => {
    if (!isLoading && cart.length === 0) {
      addToCart(mockCourses[0]);
      addToCart(mockCourses[1]);
      addToCart(mockCourses[2]);
    }
  }, [isLoading, cart.length, addToCart]);

  const subtotal = getTotal();
  const discount = getDiscount();
  const total = subtotal;

  const handlePaymentMethodChange = (value: string) => {
    const method = paymentMethods.find((m) => m.id === value);
    setSelectedPaymentMethod(method || null);
    setValidationErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (field === "cardExpiry") {
      formattedValue = formatCardExpiry(value);
    }

    setPaymentData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validatePaymentData = () => {
    const errors: Record<string, string> = {};

    if (!selectedPaymentMethod) {
      errors.paymentMethod = "Selecione um método de pagamento";
      return errors;
    }

    if (selectedPaymentMethod.type !== "pix") {
      if (!paymentData.cardNumber) {
        errors.cardNumber = "Número do cartão é obrigatório";
      } else if (!validateCardNumber(paymentData.cardNumber)) {
        errors.cardNumber = "Número do cartão inválido";
      }

      if (!paymentData.cardName) {
        errors.cardName = "Nome no cartão é obrigatório";
      } else if (paymentData.cardName.length < 2) {
        errors.cardName = "Nome deve ter pelo menos 2 caracteres";
      }

      if (!paymentData.cardExpiry) {
        errors.cardExpiry = "Data de validade é obrigatória";
      } else if (!validateCardExpiry(paymentData.cardExpiry)) {
        errors.cardExpiry = "Data de validade inválida";
      }

      if (!paymentData.cardCvv) {
        errors.cardCvv = "CVV é obrigatório";
      } else if (!validateCvv(paymentData.cardCvv)) {
        errors.cardCvv = "CVV inválido";
      }
    }

    return errors;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleCheckout = async () => {
    const errors = validatePaymentData();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const jwt = await getTokenFromCookies();
    const courseId = localStorage.getItem("courseId")
    try {
      await buyCourse(jwt!, courseId!, "P", 50)
    } catch (error) {
      
    }

    setIsProcessing(true);

    // Simular processamento do pagamento
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccessModalOpen(true);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const CourseCard = ({ item }: { item: CartItem }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {item.course.category}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {item.course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.course.instructor}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {item.course.studentsCount}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {item.course.rating}
                  </div>
                </div>

                <Badge variant="secondary">{item.course.level}</Badge>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {item.course.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(item.course.originalPrice)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(item.course.price)}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCartHook(item.course.id)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remover
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">
            Revise seus cursos e complete o pagamento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carrinho */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Seus Cursos ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Seu carrinho está vazio
                  </p>
                ) : (
                  cart.map((item) => (
                    <CourseCard key={item.course.id} item={item} />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Método de Pagamento */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Método de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="payment-method">
                    Selecione o método de pagamento
                  </Label>
                  <Select onValueChange={handlePaymentMethodChange}>
                    <SelectTrigger
                      className={
                        validationErrors.paymentMethod ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Escolha como deseja pagar" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center">
                            <PaymentIcon
                              type={method.type}
                              className="w-4 h-4 mr-2"
                            />
                            {method.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.paymentMethod}
                    </p>
                  )}
                </div>

                {selectedPaymentMethod &&
                  selectedPaymentMethod.type !== "pix" && (
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="card-number">Número do Cartão</Label>
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            value={paymentData.cardNumber}
                            onChange={(e) =>
                              handleInputChange("cardNumber", e.target.value)
                            }
                            className={
                              validationErrors.cardNumber
                                ? "border-red-500"
                                : ""
                            }
                            maxLength={19}
                          />
                          {validationErrors.cardNumber && (
                            <p className="text-red-500 text-sm mt-1">
                              {validationErrors.cardNumber}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="card-name">Nome no Cartão</Label>
                          <Input
                            id="card-name"
                            placeholder="João Silva"
                            value={paymentData.cardName}
                            onChange={(e) =>
                              handleInputChange("cardName", e.target.value)
                            }
                            className={
                              validationErrors.cardName ? "border-red-500" : ""
                            }
                          />
                          {validationErrors.cardName && (
                            <p className="text-red-500 text-sm mt-1">
                              {validationErrors.cardName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="card-expiry">Validade</Label>
                          <Input
                            id="card-expiry"
                            placeholder="MM/AA"
                            value={paymentData.cardExpiry}
                            onChange={(e) =>
                              handleInputChange("cardExpiry", e.target.value)
                            }
                            className={
                              validationErrors.cardExpiry
                                ? "border-red-500"
                                : ""
                            }
                            maxLength={5}
                          />
                          {validationErrors.cardExpiry && (
                            <p className="text-red-500 text-sm mt-1">
                              {validationErrors.cardExpiry}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="card-cvv">CVV</Label>
                          <Input
                            id="card-cvv"
                            placeholder="123"
                            value={paymentData.cardCvv}
                            onChange={(e) =>
                              handleInputChange("cardCvv", e.target.value)
                            }
                            className={
                              validationErrors.cardCvv ? "border-red-500" : ""
                            }
                            maxLength={4}
                          />
                          {validationErrors.cardCvv && (
                            <p className="text-red-500 text-sm mt-1">
                              {validationErrors.cardCvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                {selectedPaymentMethod &&
                  selectedPaymentMethod.type === "pix" && (
                    <div className="pt-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <Smartphone className="w-12 h-12 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-semibold text-blue-900 mb-2">
                          Pagamento via PIX
                        </h3>
                        <p className="text-sm text-blue-700">
                          Após confirmar a compra, você receberá um código PIX
                          para pagamento
                        </p>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo da Compra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog
                  open={isSuccessModalOpen}
                  onOpenChange={setIsSuccessModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      onClick={handleCheckout}
                      disabled={isProcessing || cart.length === 0}
                    >
                      {isProcessing ? "Processando..." : "Finalizar Compra"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-green-600">
                        <Check className="w-6 h-6 mr-2" />
                        Compra Confirmada!
                      </DialogTitle>
                      <DialogDescription className="text-center py-4">
                        <div className="space-y-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <span className="text-green-800 font-semibold">
                              Parabéns! Sua compra foi processada com sucesso.
                            </span>
                            <span className="text-sm text-green-700 mt-2">
                              Você receberá um email com os detalhes da compra e
                              instruções para acessar seus cursos.
                            </span>
                          </div>

                          <div className="border rounded-lg p-4 bg-gray-50">
                            <h4 className="font-semibold mb-2">
                              Cursos Adquiridos:
                            </h4>
                            <ul className="text-sm space-y-1 text-left">
                              {cart.map((item) => (
                                <li
                                  key={item.course.id}
                                  className="flex items-center"
                                >
                                  <Check className="w-3 h-3 mr-2 text-green-500" />
                                  {item.course.title}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="text-sm text-gray-600 flex items-center justify-between">
                            <span>
                              Total pago:{" "}
                              <span className="font-bold">
                                {formatCurrency(total)}
                              </span>
                            </span>
                            {selectedPaymentMethod && (
                              <PaymentMethodBadge
                                type={selectedPaymentMethod.type}
                              />
                            )}
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center">
                      <Button
                        onClick={() => setIsSuccessModalOpen(false)}
                        className="w-full"
                      >
                        Continuar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
