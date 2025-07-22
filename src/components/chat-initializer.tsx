"use client";

import { useEffect } from "react";
import { useChat } from "@/providers/chat-provider";

interface ChatInitializerProps {
  userCourses?: Array<{ id: number; title: string }>;
  currentUserId?: number;
}

export default function ChatInitializer({
  userCourses = [],
  currentUserId,
}: ChatInitializerProps) {
  const { updateUserCourses, setCurrentUserId } = useChat();

  useEffect(() => {
    if (userCourses.length > 0) {
      updateUserCourses(userCourses);
    }
  }, [userCourses, updateUserCourses]);

  useEffect(() => {
    if (currentUserId) {
      setCurrentUserId(currentUserId);
    }
  }, [currentUserId, setCurrentUserId]);

  return null;
}
