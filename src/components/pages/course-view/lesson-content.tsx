"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  BookOpen,
  CheckCircle,
  Clock,
  HelpCircle,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import {
  Lesson,
  VideoLesson,
  TextLesson,
  QuestionLesson,
} from "@/shared/lesson";

interface LessonContentProps {
  lesson: Lesson;
  onMarkCompleted: (lessonId: string) => void;
}

export default function LessonContent({
  lesson,
  onMarkCompleted,
}: LessonContentProps) {
  const [isCompleted, setIsCompleted] = useState(lesson.isCompleted);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleMarkCompleted = () => {
    setIsCompleted(true);
    onMarkCompleted(lesson.id);
  };

  const renderVideoContent = (videoLesson: VideoLesson) => (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <div className="aspect-video bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
            <p className="text-lg mb-2">Vídeo: {videoLesson.title}</p>
            <p className="text-sm opacity-70">
              Duração: {videoLesson.duration}
            </p>
          </div>
        </div>

        {/* Controles do vídeo (mockados) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <div className="flex-1 mx-4">
              <div className="h-1 bg-white/20 rounded-full">
                <div className="h-1 bg-white rounded-full w-1/3"></div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {videoLesson.transcript && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transcrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">
              {videoLesson.transcript}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTextContent = (textLesson: TextLesson) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <BookOpen className="w-4 h-4" />
        <span>Tempo de leitura: {textLesson.readingTime}</span>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {textLesson.content}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuestionContent = (questionLesson: QuestionLesson) => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{questionLesson.question}</h3>

            <div className="space-y-2">
              {questionLesson.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="quiz-answer"
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => setSelectedAnswer(index)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label
                    htmlFor={`option-${index}`}
                    className="text-sm font-medium leading-none"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowAnswer(true)}
                disabled={selectedAnswer === null || showAnswer}
                className="mt-4"
              >
                Verificar Resposta
              </Button>
              {showAnswer && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAnswer(null);
                    setShowAnswer(false);
                  }}
                  className="mt-4"
                >
                  Tentar Novamente
                </Button>
              )}
            </div>

            {showAnswer && (
              <div className="mt-4 p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === questionLesson.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs">✗</span>
                    </div>
                  )}
                  <span className="font-medium">
                    {selectedAnswer === questionLesson.correctAnswer
                      ? "Correto!"
                      : "Incorreto"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Resposta correta:{" "}
                  {questionLesson.options[questionLesson.correctAnswer]}
                </p>
                {questionLesson.explanation && (
                  <p className="text-sm text-gray-700 mt-2">
                    {questionLesson.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (lesson.type) {
      case "video":
        return renderVideoContent(lesson as VideoLesson);
      case "text":
        return renderTextContent(lesson as TextLesson);
      case "question":
        return renderQuestionContent(lesson as QuestionLesson);
      default:
        return <div>Tipo de conteúdo não suportado</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da Lição */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-xs">
                  {lesson.type === "video"
                    ? "Vídeo"
                    : lesson.type === "text"
                      ? "Texto"
                      : lesson.type === "question"
                        ? "Quiz"
                        : "Conteúdo"}
                </Badge>
                {lesson.duration && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </span>
                )}
              </div>
              <CardTitle className="text-xl mb-2">{lesson.title}</CardTitle>
              <p className="text-gray-600">{lesson.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isCompleted ? "default" : "secondary"}>
                {isCompleted ? "Concluído" : "Pendente"}
              </Badge>
              {!isCompleted && (
                <Button onClick={handleMarkCompleted} size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Concluído
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Conteúdo da Lição */}
      <div>{renderContent()}</div>

      {/* Ações de Navegação */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" disabled>
              <SkipBack className="w-4 h-4 mr-2" />
              Aula Anterior
            </Button>
            <div className="flex items-center gap-2">
              {!isCompleted && (
                <Button onClick={handleMarkCompleted} variant="outline">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Concluído
                </Button>
              )}
              <Button>
                Próxima Aula
                <SkipForward className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
