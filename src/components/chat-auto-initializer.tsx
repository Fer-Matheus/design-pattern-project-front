"use client";

import { useEffect, useState } from "react";
import { useChat } from "@/providers/chat-provider";
import { useCachedUserData } from "@/hooks/use-cached-user-data";

export default function ChatAutoInitializer() {
  const { updateUserCourses, setCurrentUserId, userCourses, currentUserId } =
    useChat();
  const { userData, userCourses: cachedCourses, loading } = useCachedUserData();
  const [isClient, setIsClient] = useState(false);

  // Garante que só executa no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Só executar no cliente e quando não estiver carregando
    if (!isClient || loading) {
      return;
    }

    // Se já temos todos os dados, não fazer nada
    if (currentUserId && userCourses.length > 0) {
      return;
    }

    // Atualizar dados do chat com os dados em cache
    if (userData?.id && !currentUserId) {
      setCurrentUserId(userData.id);
    }

    if (cachedCourses.length > 0 && userCourses.length === 0) {
      updateUserCourses(cachedCourses);
    }
  }, [
    isClient,
    userData,
    cachedCourses,
    loading,
    updateUserCourses,
    setCurrentUserId,
    userCourses.length,
    currentUserId,
  ]);

  // Não renderizar nada durante SSR
  if (!isClient) {
    return null;
  }

  return null;
}
