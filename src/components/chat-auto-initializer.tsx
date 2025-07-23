"use client";

import { useEffect } from "react";
import { useChat } from "@/providers/chat-provider";
import { useCachedUserData } from "@/hooks/use-cached-user-data";

export default function ChatAutoInitializer() {
  const { updateUserCourses, setCurrentUserId, userCourses, currentUserId } =
    useChat();
  const { userData, userCourses: cachedCourses, loading } = useCachedUserData();

  useEffect(() => {
    // Se está carregando ou já temos todos os dados, não fazer nada
    if (loading || (currentUserId && userCourses.length > 0)) {
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
    userData,
    cachedCourses,
    loading,
    updateUserCourses,
    setCurrentUserId,
    userCourses.length,
    currentUserId,
  ]);

  return null;
}
