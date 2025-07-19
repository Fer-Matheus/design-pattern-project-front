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
import { Toast } from "@/components/ui/toast";
import { PlusIcon, CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCourseSchema>({
    resolver: zodResolver(createCourseSchema),
  });

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

  async function handleCreateCourseSubmit(data: CreateCourseSchema) {
    setIsLoading(true);
    const jwt = await getTokenFromCookies();

    try {
      await createCourse(jwt!, data);

      // Mostrar toast de sucesso
      showSuccessToast("Curso criado com sucesso!");

      // Fechar modal
      setIsOpen(false);

      // Limpar formulário
      reset();

      // Recarregar página após um breve delay
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao criar curso:", error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Erro ao criar curso. Tente novamente.";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">Título é obrigatório</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="dê uma descrição breve do curso"
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    Descrição é obrigatória
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  placeholder="R$50"
                  {...register("price")}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">Preço é obrigatório</p>
                )}
              </div>
            </div>
            <DialogFooter className="pt-5">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                className="hover:scale-110 active:scale-95"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Concluir"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
    </>
  );
}
