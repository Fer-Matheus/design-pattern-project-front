"use client";

import { useChat } from "@/providers/chat-provider";
import { useState, useEffect, useRef } from "react";
import ChatWidget from "./chat-widget";
import ChatAutoInitializer from "./chat-auto-initializer";

export default function ChatWrapper() {
  const { userCourses, currentUserId } = useChat();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Garante que só executa no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Verificar se há token nos cookies (usuário logado)
    const checkLoginStatus = () => {
      if (typeof document === "undefined") return;

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

    // Verificar inicialmente
    checkLoginStatus();

    // Verificar periodicamente (30 segundos)
    const interval = setInterval(checkLoginStatus, 30000);

    return () => {
      clearInterval(interval);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [isClient]);

  // Não renderizar nada durante SSR ou se não estiver logado
  if (!isClient || !isLoggedIn) {
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
