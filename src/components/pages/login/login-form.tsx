"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/ui/toast";
import { login } from "@/service/auth";
import { setCookie } from "cookies-next";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showSuccessToast = (message: string) => {
    setToastType("success");
    setToastMessage(message);
    setShowToast(true);
  };

  const showErrorToast = (message: string) => {
    setToastType("error");
    setToastMessage(message);
    setShowToast(true);
  };

  const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(email, password);

      console.log(response);

      if (response) {
        setCookie("access-token", response.access_token);
        showSuccessToast("Login realizado com sucesso! Redirecionando...");

        // Aguardar um pouco para mostrar o toast antes de redirecionar
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Login inválido: verifique suas credenciais";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-start p-4 pl-0">
      <div className="w-full max-w-lg rounded-xl forms-bg p-6 shadow-2xl">
        <Card className="bg-white border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Login
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Entre e desfrute dos seus cursos favoritos.
            </CardDescription>
          </CardHeader>

          <form onSubmit={onsubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Toast de notificação */}
      {showToast && (
        <Toast variant={toastType} onClose={() => setShowToast(false)}>
          <div className="flex items-center space-x-2">
            {toastType === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">{toastMessage}</span>
          </div>
        </Toast>
      )}
    </div>
  );
}
