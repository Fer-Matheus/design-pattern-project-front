"use client"
import { getUserData } from "@/service/auth";
import { MyData } from "@/shared/user";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function Home(){


  const [data, setData] = useState<MyData>();
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getCookie("access-token");

        if (!token) {
          setErro("Token não encontrado");
          return;
        }

        const response = await getUserData(token.toString());

        setData(response);
      } catch (err: any) {
        setErro(err?.response?.data?.message || "Erro na requisição");
        console.error(err);
      }
    }

    fetchData();
  }, []);

  console.log("Data: ", data)
  console.log("Erro: ", erro)
  
    return (
        <section>
        <h1 className="text-xl">Bem vindo</h1>
        <h1 className="text-2xl font-bold">{data?.first_name} {data?.last_name}</h1>
        </section>
    );
}