"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, register } from "@/service/auth";
import { setCookie } from "cookies-next";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(email, password);

      console.log(response);

      if (response) {
        setCookie("access-token", response.access_token);
      }

      router.push("/");
    } catch (error) {
      alert("Login inválido: verifique suas credenciais")
    }
  };

  return (
    <form
      className="flex w-full h-[30rem] rounded-xl forms-bg justify-center items-center p-5 pl-10 pr-10"
      onSubmit={onsubmit}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Entre e desfrute dos seus cursos favoritos.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 ">
          <div className="grid gap-3">
            <Label htmlFor="tabs-demo-name">Usuário</Label>
            <Input
              id="tabs-demo-name"
              type="text"
              placeholder="Coloque seu usuário aqui"
              value={email}
              onChange={(value) => setEmail(value.currentTarget.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tabs-demo-username">Senha</Label>
            <Input
              type="password"
              id="tabs-demo-username"
              placeholder="Coloque sua senha aqui"
              value={password}
              onChange={(value) => setPassword(value.currentTarget.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Login</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
