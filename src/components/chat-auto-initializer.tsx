"use client";

import { useEffect } from "react";
import { useChat } from "@/providers/chat-provider";
import { getUserCourses, getUserData } from "@/service/auth";

export default function ChatAutoInitializer() {
  const { updateUserCourses, setCurrentUserId } = useChat();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Pegar o token dos cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access-token="))
          ?.split("=")[1];

        if (!token) return;

        // Buscar dados do usuário
        const userData = await getUserData(token);
        if (userData?.id) {
          setCurrentUserId(userData.id);
        }

        // Buscar cursos do usuário
        const userRole = userData?.user_type === "S" ? "aluno" : "professor";

        let courses: Array<{ id: number; title: string }> = [];

        if (userRole === "aluno") {
          try {
            const userCourses = await getUserCourses(token);
            if (userCourses?.items) {
              courses = userCourses.items.map((course) => ({
                id: course.id,
                title: course.title,
              }));
            }
          } catch (error) {
            console.log(
              "Não foi possível carregar cursos do aluno para o chat"
            );
          }
        } else if (userRole === "professor" && userData?.courses_teaching) {
          courses = userData.courses_teaching.map((course) => ({
            id: course.id,
            title: course.title,
          }));
        }

        if (courses.length > 0) {
          updateUserCourses(courses);
        }
      } catch (error) {
        console.log("Erro ao inicializar chat:", error);
      }
    };

    initializeChat();
  }, [updateUserCourses, setCurrentUserId]);

  return null;
}
