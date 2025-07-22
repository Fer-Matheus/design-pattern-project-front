"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Minus, Send, Users, X } from "lucide-react";
import { Message, CourseChat } from "@/shared/chat";
import { getMessages, sendMessage } from "@/service/auth";

interface ChatWidgetProps {
  userCourses?: Array<{ id: number; title: string }>;
  currentUserId?: number;
}

export default function ChatWidget({
  userCourses = [],
  currentUserId,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (courseId: number) => {
    try {
      setIsLoading(true);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access-token="))
        ?.split("=")[1];

      if (!token) return;

      const response = await getMessages(token, courseId.toString());
      if (response && Array.isArray(response)) {
        setMessages(response);
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCourse) return;

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access-token="))
        ?.split("=")[1];

      if (!token) return;

      await sendMessage(token, newMessage, selectedCourse);
      setNewMessage("");

      // Recarrega as mensagens
      await loadMessages(selectedCourse);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourse(courseId);
    loadMessages(courseId);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Chat Button - Mostra quando fechado OU quando minimizado */}
      {(!isOpen || isMinimized) && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Widget - Mostra apenas quando aberto E não minimizado */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 w-80 shadow-2xl">
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <CardTitle className="text-sm font-medium">
                    Chat do Curso
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(true)}
                    className="text-white hover:bg-blue-700 h-8 w-8 p-0"
                    title="Minimizar"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-blue-700 h-8 w-8 p-0"
                    title="Fechar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Course Selection */}
              {!selectedCourse && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-sm">
                      {userCourses.length > 0
                        ? "Selecione um curso:"
                        : "Chat dos Cursos"}
                    </h4>
                  </div>

                  {userCourses.length > 0 ? (
                    userCourses.map((course) => (
                      <Button
                        key={course.id}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => handleCourseSelect(course.id)}
                      >
                        <div className="text-sm">
                          <div className="font-medium">{course.title}</div>
                          <div className="text-gray-500 text-xs">
                            Clique para abrir o chat
                          </div>
                        </div>
                      </Button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm mb-2">Nenhum curso disponível</p>
                      <p className="text-xs">
                        Matricule-se em um curso para participar dos chats!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Messages */}
              {selectedCourse && (
                <div className="flex flex-col h-96">
                  {/* Chat Header */}
                  <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">
                        {
                          userCourses.find((c) => c.id === selectedCourse)
                            ?.title
                        }
                      </h4>
                      <p className="text-xs text-gray-500">
                        {messages.length} mensagens
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCourse(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ← Voltar
                    </Button>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {isLoading ? (
                      <div className="text-center text-gray-500 text-sm">
                        Carregando mensagens...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 text-sm">
                        Nenhuma mensagem ainda. Seja o primeiro a conversar!
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === currentUserId
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-2 rounded-lg text-sm ${
                              message.sender_id === currentUserId
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <div>{message.content}</div>
                            <div
                              className={`text-xs mt-1 ${
                                message.sender_id === currentUserId
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.created_at)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-3 border-t bg-gray-50">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
