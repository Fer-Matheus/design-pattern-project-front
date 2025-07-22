"use client";

import { useChat } from "@/providers/chat-provider";
import { useState, useEffect } from "react";
import ChatWidget from "./chat-widget";
import ChatAutoInitializer from "./chat-auto-initializer";

export default function ChatWrapper() {
  const { userCourses, currentUserId } = useChat();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar se há token nos cookies (usuário logado)
    const checkLoginStatus = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access-token="))
        ?.split("=")[1];

      setIsLoggedIn(!!token);
    };

    // Verificar inicialmente
    checkLoginStatus();

    // Verificar periodicamente (caso o token expire ou seja removido)
    const interval = setInterval(checkLoginStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  // Só renderiza o chat se o usuário estiver logado
  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <ChatAutoInitializer />
      <ChatWidget
        userCourses={userCourses}
        currentUserId={currentUserId ?? undefined}
      />
    </>
  );
}
