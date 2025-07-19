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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toast } from "@/components/ui/toast";
import { register } from "@/service/auth";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function RegisterForm({
  onSuccessfulRegistration,
}: {
  onSuccessfulRegistration?: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
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

  const registerOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação básica
    if (password !== confirmPassword) {
      showErrorToast("As senhas não coincidem!");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      showErrorToast("A senha deve ter pelo menos 6 caracteres!");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        email: email,
        password: password,
        is_active: true,
        is_superuser: false,
        is_verified: true,
        first_name: firstName,
        last_name: lastName,
        user_type: role,
      });

      showSuccessToast("Cadastro realizado com sucesso! Redirecionando...");

      // Limpar formulário
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setRole("");

      // Aguardar um pouco para mostrar o toast antes de redirecionar para o login
      setTimeout(() => {
        setShowToast(false);
        // Usar o callback para mudar para a aba de login
        onSuccessfulRegistration?.();
      }, 2000);
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Erro interno do servidor. Tente novamente.";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-start p-4 pl-0">
      <div className="w-full max-w-lg rounded-xl forms-bg p-6 shadow-2xl overflow-y-auto max-h-[calc(100vh-12rem)]">
        <Card className="bg-white border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Cadastro
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Crie sua conta para começar a usar a plataforma.
            </CardDescription>
          </CardHeader>

          <form onSubmit={registerOnSubmit}>
            <CardContent className="space-y-5">
              {/* Nome completo em grid responsivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Primeiro nome
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Seu primeiro nome"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sobrenome
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Seu sobrenome"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirmar senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="userType"
                  className="text-sm font-medium text-gray-700"
                >
                  Tipo de usuário
                </Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Selecione seu tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="S">👨‍🎓 Aluno</SelectItem>
                      <SelectItem value="I">👨‍🏫 Professor</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>

            <CardFooter className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
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
