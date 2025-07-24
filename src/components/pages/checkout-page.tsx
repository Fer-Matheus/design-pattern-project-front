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
  ShoppingCart,
  Check,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { PaymentMethod } from "@/shared/course";
import { useCart } from "@/providers/cart-provider";
import { getTokenFromCookies } from "@/lib/getToken";
import { buyCourse, getCourseById } from "@/service/auth";
import { Course, FullCourse } from "@/shared/course";

// Função para converter FullCourse para Course
const convertFullCourseToTheme = (fullCourse: FullCourse): Course => ({
  id: fullCourse.id.toString(),
  title: fullCourse.title,
  description: fullCourse.description,
  price: fullCourse.price,
  instructor: "Instrutor", // Valor padrão, pode ser melhorado com dados do instrutor
  duration: `${fullCourse.lessons?.length || 0} lições`,
  level: "Iniciante" as const, // Valor padrão
  image: "/placeholder-course.jpg", // Imagem padrão
  rating: 4.5, // Rating padrão
  studentsCount: 0, // Valor padrão
  category: "Geral", // Categoria padrão
});

// Métodos de pagamento simplificados
const paymentMethods: PaymentMethod[] = [
  {
    id: "credit",
    name: "Cartão de Crédito",
    type: "credit",
    icon: "💳",
  },
  {
    id: "pix",
    name: "PIX",
    type: "pix",
    icon: "📱",
  },
  {
    id: "boleto",
    name: "Boleto",
    type: "debit",
    icon: "🧾",
  },
];

export default function CheckoutPageContent() {
  const {
    cart,
    removeFromCart: removeFromCartHook,
    getTotal,
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
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);

  // Calcular valores com desconto PIX
  const basePrice = selectedCourse ? selectedCourse.price : getTotal();
  const pixDiscount =
    selectedPaymentMethod?.type === "pix" ? basePrice * 0.05 : 0;
  const finalPrice = basePrice - pixDiscount;

  // Buscar curso específico baseado no courseId do localStorage
  useEffect(() => {
    const loadSelectedCourse = async () => {
      const courseId = localStorage.getItem("courseId");

      if (!courseId) {
        setCourseError(
          "Nenhum curso selecionado. Volte à página de cursos e selecione um curso."
        );
        return;
      }

      try {
        setCourseLoading(true);
        setCourseError(null);

        const jwt = await getTokenFromCookies();
        if (!jwt) {
          setCourseError("Faça login para continuar com a compra.");
          return;
        }

        const course = await getCourseById(courseId);

        if (course) {
          const convertedCourse = convertFullCourseToTheme(course);
          setSelectedCourse(convertedCourse);
          // Adicionar ao carrinho se não estiver lá
          const courseInCart = cart.find(
            (item) => item.course.id === convertedCourse.id
          );
          if (!courseInCart) {
            addToCart(convertedCourse);
          }
        } else {
          setCourseError("Curso não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao carregar curso:", error);
        setCourseError("Erro ao carregar dados do curso. Tente novamente.");
      } finally {
        setCourseLoading(false);
      }
    };

    loadSelectedCourse();
  }, [addToCart, cart]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      alert("Selecione um método de pagamento");
      return;
    }

    if (
      selectedPaymentMethod.type === "credit" &&
      (!paymentData.cardNumber || !paymentData.cardName)
    ) {
      alert("Preencha os dados do cartão");
      return;
    }

    const jwt = await getTokenFromCookies();
    const courseId = localStorage.getItem("courseId");

    if (!jwt) {
      alert("Você precisa estar logado para fazer a compra");
      return;
    }

    if (!courseId) {
      alert(
        "ID do curso não encontrado. Volte à página de cursos e selecione novamente."
      );
      return;
    }

    try {
      setIsProcessing(true);

      // Determinar o tipo de pagamento baseado no método selecionado
      const paymentType = selectedPaymentMethod.type === "pix" ? "P" : "C";

      await buyCourse(jwt, courseId, paymentType, finalPrice);

      // Simular processamento
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccessModalOpen(true);
      }, 1500);
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setIsProcessing(false);

      // Tratamento de erro mais específico
      if (error instanceof Error) {
        alert(`Erro ao processar pagamento: ${error.message}`);
      } else {
        alert(
          "Erro ao processar pagamento. Verifique sua conexão e tente novamente."
        );
      }
    }
  };

  if (isLoading || courseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoading ? "Carregando..." : "Carregando dados do curso..."}
          </p>
        </div>
      </div>
    );
  }

  // Exibir erro se houver problema ao carregar o curso
  if (courseError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ops! Algo deu errado
          </h2>
          <p className="text-gray-600 mb-6">{courseError}</p>
          <Button onClick={() => window.history.back()} className="mr-4">
            Voltar
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">
            Complete sua compra de forma rápida e segura
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumo dos Cursos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                {selectedCourse
                  ? "Curso Selecionado"
                  : `Seus Cursos (${cart.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCourse ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {selectedCourse.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedCourse.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-xl">
                        {formatCurrency(selectedCourse.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum curso no carrinho</p>
                  <p className="text-sm text-gray-400">
                    Selecione um curso para continuar com a compra
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.course.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.course.title}</h3>
                        <p className="text-sm text-gray-600">
                          {item.course.instructor}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {formatCurrency(item.course.price)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCartHook(item.course.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagamento e Resumo */}
          <div className="space-y-6">
            {/* Método de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Método de Pagamento</Label>
                  <Select
                    onValueChange={(value) => {
                      const method = paymentMethods.find((m) => m.id === value);
                      setSelectedPaymentMethod(method || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha como pagar" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.icon} {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPaymentMethod?.type === "credit" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Número do Cartão</Label>
                        <Input
                          placeholder="**** **** **** ****"
                          value={paymentData.cardNumber}
                          onChange={(e) =>
                            setPaymentData((prev) => ({
                              ...prev,
                              cardNumber: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Nome no Cartão</Label>
                        <Input
                          placeholder="Seu nome"
                          value={paymentData.cardName}
                          onChange={(e) =>
                            setPaymentData((prev) => ({
                              ...prev,
                              cardName: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Validade</Label>
                        <Input
                          placeholder="MM/AA"
                          value={paymentData.cardExpiry}
                          onChange={(e) =>
                            setPaymentData((prev) => ({
                              ...prev,
                              cardExpiry: e.target.value,
                            }))
                          }
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label>CVV</Label>
                        <Input
                          placeholder="123"
                          value={paymentData.cardCvv}
                          onChange={(e) =>
                            setPaymentData((prev) => ({
                              ...prev,
                              cardCvv: e.target.value,
                            }))
                          }
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod?.type === "pix" && (
                  <div className="pt-4 border-t">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-2xl">📱</span>
                          <h3 className="font-semibold text-green-900">
                            Pagamento via PIX
                          </h3>
                        </div>
                        <p className="text-green-800 text-sm mb-3">
                          Você receberá um código PIX após confirmar a compra
                        </p>

                        {pixDiscount > 0 && (
                          <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                            <p className="text-green-800 font-semibold text-sm">
                              🎉 Desconto especial de 5% aplicado!
                            </p>
                            <p className="text-green-700 text-xs mt-1">
                              Economize {formatCurrency(pixDiscount)} escolhendo
                              PIX
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resumo Final */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(basePrice)}</span>
                  </div>

                  {selectedPaymentMethod?.type === "pix" && pixDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        📱 Desconto PIX (5%)
                      </span>
                      <span>-{formatCurrency(pixDiscount)}</span>
                    </div>
                  )}

                  <hr className="border-gray-200" />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <div className="text-right">
                      {selectedPaymentMethod?.type === "pix" &&
                      pixDiscount > 0 ? (
                        <div>
                          <div className="text-sm text-gray-500 line-through font-normal">
                            {formatCurrency(basePrice)}
                          </div>
                          <div className="text-green-600">
                            {formatCurrency(finalPrice)}
                          </div>
                        </div>
                      ) : (
                        <span>{formatCurrency(finalPrice)}</span>
                      )}
                    </div>
                  </div>

                  {selectedPaymentMethod?.type === "pix" && pixDiscount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-green-800 font-medium">
                        🎉 Você está economizando {formatCurrency(pixDiscount)}{" "}
                        pagando com PIX!
                      </p>
                    </div>
                  )}
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
                      disabled={
                        isProcessing || (!selectedCourse && cart.length === 0)
                      }
                      size="lg"
                    >
                      {isProcessing
                        ? "Processando..."
                        : `Pagar ${formatCurrency(finalPrice)}${
                            selectedPaymentMethod?.type === "pix" &&
                            pixDiscount > 0
                              ? ` (Economia: ${formatCurrency(pixDiscount)})`
                              : ""
                          }`}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-green-600">
                        <Check className="w-6 h-6 mr-2" />
                        Compra Confirmada!
                      </DialogTitle>
                      <DialogDescription className="text-center py-4">
                        <div className="space-y-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 font-semibold">
                              ✅ Pagamento processado com sucesso!
                            </p>
                            <p className="text-sm text-green-700 mt-2">
                              Você receberá um email com os detalhes e acesso
                              aos cursos.
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-gray-600">
                              Total pago:{" "}
                              <span className="font-bold">
                                {formatCurrency(finalPrice)}
                              </span>
                            </p>
                            {selectedPaymentMethod?.type === "pix" &&
                              pixDiscount > 0 && (
                                <p className="text-green-600 text-sm mt-1">
                                  Você economizou {formatCurrency(pixDiscount)}{" "}
                                  com PIX!
                                </p>
                              )}
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsSuccessModalOpen(false)}
                        className="flex-1"
                      >
                        Fechar
                      </Button>
                      <Button
                        onClick={() => {
                          // Limpar dados locais
                          localStorage.removeItem("courseId");
                          // Redirecionar para página inicial
                          window.location.href = "/";
                        }}
                        className="flex-1"
                      >
                        Ver Meus Cursos
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
