"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ChatContextType {
  userCourses: Array<{ id: number; title: string }>;
  currentUserId: number | null;
  updateUserCourses: (courses: Array<{ id: number; title: string }>) => void;
  setCurrentUserId: (userId: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [userCourses, setUserCourses] = useState<
    Array<{ id: number; title: string }>
  >([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const updateUserCourses = (courses: Array<{ id: number; title: string }>) => {
    setUserCourses(courses);
  };

  const setUserId = (userId: number) => {
    setCurrentUserId(userId);
  };

  return (
    <ChatContext.Provider
      value={{
        userCourses,
        currentUserId,
        updateUserCourses,
        setCurrentUserId: setUserId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
