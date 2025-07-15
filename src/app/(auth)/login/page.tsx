import Image from "next/image";

import GirlRaising from "@/../public/girl-raising.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/pages/login/login-form";
import RegisterForm from "@/components/pages/register/register-form";

export default function Login() {
  return (
    <div className="w-screen h-screen bg-gray-170 flex justify-center items-center">
      <div className="w-4/7 h-full flex justify-center items-center">
        <Image src={GirlRaising} width={550} height={300} alt="Girl raising" />
      </div>
      <div className="w-4/7 h-screen flex items-center justify-center">
        <div className=" w-[40rem]">
          <h1 className="typing">Learnify</h1>
          <Tabs defaultValue="Login">
          <TabsList>
            <TabsTrigger value="Login">Login</TabsTrigger>
            <TabsTrigger value="Register">Cadastre-se</TabsTrigger>
          </TabsList>
          <TabsContent value="Login">
            <LoginForm/>
          </TabsContent>
          <TabsContent value="Register">
            <RegisterForm/>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
