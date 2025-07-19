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
import { register } from "@/service/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  const registerOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log(email);
      console.log(password);
      console.log(firstName);
      console.log(lastName);
      console.log(role);

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
      router.refresh();
    } catch (error) {
      console.error("Erro no cadastro:", error);
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
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Cadastrar
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
