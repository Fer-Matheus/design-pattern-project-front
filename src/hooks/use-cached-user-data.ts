import { useState, useEffect } from "react";
import { getUserCourses, getUserData } from "@/service/auth";
import { MyData } from "@/shared/user";

interface UseCachedUserDataReturn {
  userData: MyData | null;
  userCourses: Array<{ id: number; title: string }>;
  loading: boolean;
  error: string | null;
}

// Cache global simples para evitar requisições duplicadas
let cachedUserData: MyData | null = null;
let cachedUserCourses: Array<{ id: number; title: string }> = [];
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useCachedUserData(): UseCachedUserDataReturn {
  const [userData, setUserData] = useState<MyData | null>(cachedUserData);
  const [userCourses, setUserCourses] =
    useState<Array<{ id: number; title: string }>>(cachedUserCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Só executar no cliente
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      const now = Date.now();

      // Se temos dados em cache e não são muito antigos, usar cache
      if (
        cachedUserData &&
        cachedUserCourses.length > 0 &&
        now - lastCacheTime < CACHE_DURATION
      ) {
        setUserData(cachedUserData);
        setUserCourses(cachedUserCourses);
        setLoading(false);
        return;
      }

      // Verificar se há token (apenas no cliente)
      if (typeof document === "undefined") {
        setLoading(false);
        return;
      }

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access-token="))
        ?.split("=")[1];

      if (!token) {
        setError("Token não encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Buscar dados do usuário se não temos em cache ou se está desatualizado
        if (!cachedUserData || now - lastCacheTime >= CACHE_DURATION) {
          const userDataResponse = await getUserData(token);
          if (userDataResponse?.id) {
            cachedUserData = userDataResponse;
            setUserData(userDataResponse);
          }
        }

        // Buscar cursos se não temos em cache ou se está desatualizado
        if (
          cachedUserCourses.length === 0 ||
          now - lastCacheTime >= CACHE_DURATION
        ) {
          if (cachedUserData) {
            const userRole =
              cachedUserData.user_type === "S" ? "aluno" : "professor";
            let courses: Array<{ id: number; title: string }> = [];

            if (userRole === "aluno") {
              try {
                const userCoursesResponse = await getUserCourses(token);
                if (userCoursesResponse?.items) {
                  courses = userCoursesResponse.items.map((course) => ({
                    id: course.id,
                    title: course.title,
                  }));
                }
              } catch (courseError) {
                console.log(
                  "Não foi possível carregar cursos do aluno:",
                  courseError
                );
              }
            } else if (
              userRole === "professor" &&
              cachedUserData.courses_teaching
            ) {
              courses = cachedUserData.courses_teaching.map((course) => ({
                id: course.id,
                title: course.title,
              }));
            }

            cachedUserCourses = courses;
            setUserCourses(courses);
          }
        }

        lastCacheTime = now;
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { userData, userCourses, loading, error };
}

// Função para limpar cache (útil no logout)
export function clearUserDataCache() {
  cachedUserData = null;
  cachedUserCourses = [];
  lastCacheTime = 0;
}
