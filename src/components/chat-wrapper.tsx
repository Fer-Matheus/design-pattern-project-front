"use client";

import { useChat } from "@/providers/chat-provider";
import { useState, useEffect, useRef } from "react";
import ChatWidget from "./chat-widget";
import ChatAutoInitializer from "./chat-auto-initializer";

export default function ChatWrapper() {
  const { userCourses, currentUserId } = useChat();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Verificar se há token nos cookies (usuário logado)
    const checkLoginStatus = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access-token="))
        ?.split("=")[1];

      setIsLoggedIn(!!token);
    };

    // Debounce para evitar verificações muito frequentes
    const debouncedCheck = () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      checkTimeoutRef.current = setTimeout(checkLoginStatus, 100);
    };

    // Verificar inicialmente
    debouncedCheck();

    // Verificar periodicamente (30 segundos)
    const interval = setInterval(checkLoginStatus, 30000);

    return () => {
      clearInterval(interval);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
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
