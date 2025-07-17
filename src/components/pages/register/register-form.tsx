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
    
    try {

      console.log(email)
      console.log(password)
      console.log(firstName)
      console.log(lastName)
      console.log(role)
      
      await register({
        email: email,
        password: password,
        is_active: true,
        is_superuser: false,
        is_verified: true,
        first_name: firstName,
        last_name: lastName,
        user_type: role
      })

      router.refresh();

    } catch (error) {
      alert("Um erro ocorreu");
      console.error("Login failed:", error);
    }
  };

  return (
    <form
      className="flex w-full h-[45rem] rounded-xl forms-bg justify-center items-center p-5 pl-10 pr-10"
      onSubmit={registerOnSubmit}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta para começar a usar a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="tabs-demo-current">Seu primeiro nome</Label>
            <Input
              id="tabs-demo-current"
              type="text"
              placeholder="Coloque seu primeiro nome"
              value={firstName}
              onChange={(value) => setFirstName(value.currentTarget.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tabs-demo-current">Seu último nome</Label>
            <Input
              id="tabs-demo-current"
              type="text"
              placeholder="Coloque seu último nome "
              value={lastName}
              onChange={(value) => setLastName(value.currentTarget.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tabs-demo-current">Email</Label>
            <Input
              id="tabs-demo-current"
              type="text"
              placeholder="Coloque seu email aqui"
              value={email}
              onChange={(value) => setEmail(value.currentTarget.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tabs-demo-new">Senha</Label>
            <Input
              id="tabs-demo-new"
              type="password"
              placeholder="Coloque sua senha aqui"
              value={password}
              onChange={(value) => setPassword(value.currentTarget.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tabs-demo-new">Confirmar Senha</Label>
            <Input
              id="tabs-demo-new"
              type="password"
              placeholder="Confirme sua senha aqui"
              value={confirmPassword}
              onChange={(value) =>
                setConfirmPassword(value.currentTarget.value)
              }
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tabs-demo-new">Tipo de usuário</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu estado" />
              </SelectTrigger>
              <SelectContent className="max-h-72 max-w-10 text-loginLabel">
                <SelectGroup>
                  <SelectItem key="Aluno" value="S">
                    Aluno
                  </SelectItem>
                  <SelectItem key="Professor" value="I">
                    Professor
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Cadastre-se</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
