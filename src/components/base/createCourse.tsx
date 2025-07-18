"use client";
import { Button } from "@/components/ui/button";
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
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { createCourse } from "@/service/auth";
import { getTokenFromCookies } from "@/lib/getToken";
import { useRouter } from "next/navigation";

const createCourseSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  price: z.string(),
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;

export function CreateCourse() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<CreateCourseSchema>({
    resolver: zodResolver(createCourseSchema),
  });

  async function handleCreateCourseSubmit(data: CreateCourseSchema) {
    const jwt = await getTokenFromCookies();
    try {
      await createCourse(jwt!, data);
    } catch (error) {}
    router.push("/")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-20 text-md">
          <PlusIcon />
          Criar curso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[25rem] h-auto">
        <DialogHeader>
          <DialogTitle>Informações do Curso</DialogTitle>
          <DialogDescription>
            Forneça informações básicas para criar um novo curso
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateCourseSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Título do curso</Label>
              <Input
                id="title"
                placeholder="digite aqui o título do curso"
                {...register("title")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="dê uma descrição breve do curso"
                {...register("description")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="price">Preço</Label>
              <Input id="price" placeholder="R$50" {...register("price")} />
            </div>
          </div>
          <DialogFooter className="pt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button className="hover:scale-110 active:scale-95" type="submit">
              Concluir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
