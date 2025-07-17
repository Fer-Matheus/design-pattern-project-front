"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  Clock,
  User,
  Award,
  ChevronRight,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { CourseContent, Lesson, LessonStatus } from "@/shared/lesson";
import { mockCourseContent } from "@/data/mock-course-content";
import LessonContent from "./lesson-content";

export default function CourseViewPage() {
  const params = useParams();
  const [courseContent, setCourseContent] = useState<CourseContent | null>(
    null
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento do curso
    const loadCourse = async () => {
      setIsLoading(true);
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCourseContent(mockCourseContent);

      // Selecionar a lesson atual automaticamente
      const currentLesson = findCurrentLesson(mockCourseContent.lessons);
      if (currentLesson) {
        setSelectedLesson(currentLesson);
      }
      setIsLoading(false);
    };

    loadCourse();
  }, [params.id]);

  const findCurrentLesson = (lessons: Lesson[]): Lesson | null => {
    for (const lesson of lessons) {
      if (lesson.type === "module") {
        const currentInModule = findCurrentLesson(lesson.lessons);
        if (currentInModule) return currentInModule;
      } else if (lesson.status === "current") {
        return lesson;
      }
    }
    return null;
  };

  const getStatusColor = (status: LessonStatus) => {
    switch (status) {
      case "completed":
        return "bg-blue-500";
      case "current":
        return "bg-green-500";
      case "available":
        return "bg-gray-400";
      case "locked":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (lesson: Lesson) => {
    switch (lesson.status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "current":
        return <Play className="w-4 h-4 text-green-500" />;
      case "locked":
        return <Lock className="w-4 h-4 text-red-500" />;
      default:
        return getTypeIcon(lesson.type);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4 text-gray-600" />;
      case "text":
        return <BookOpen className="w-4 h-4 text-gray-600" />;
      case "question":
        return <HelpCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    if (lesson.canAccess && lesson.type !== "module") {
      setSelectedLesson(lesson);
    }
  };

  const toggleModule = (moduleId: string) => {
    if (!courseContent) return;

    const updatedLessons = courseContent.lessons.map((lesson) => {
      if (lesson.id === moduleId && lesson.type === "module") {
        return { ...lesson, isExpanded: !lesson.isExpanded };
      }
      return lesson;
    });

    setCourseContent({ ...courseContent, lessons: updatedLessons });
  };

  const markLessonAsCompleted = (lessonId: string) => {
    if (!courseContent) return;

    // Aqui você implementaria a lógica para marcar a lesson como concluída
    // Por enquanto, vamos apenas simular
    console.log(`Lesson ${lessonId} marked as completed`);
  };

  const renderLesson = (lesson: Lesson, depth: number = 0) => {
    const paddingLeft = depth * 20;

    if (lesson.type === "module") {
      return (
        <div key={lesson.id} className="mb-2">
          <div
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors`}
            style={{ paddingLeft: `${paddingLeft + 12}px` }}
            onClick={() => toggleModule(lesson.id)}
          >
            {lesson.isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(lesson.status)}`}
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
              <p className="text-sm text-gray-500">{lesson.description}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {lesson.lessons.length} aulas
            </Badge>
          </div>

          {lesson.isExpanded && (
            <div className="mt-2 space-y-1">
              {lesson.lessons.map((subLesson) =>
                renderLesson(subLesson, depth + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={lesson.id}
        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
          selectedLesson?.id === lesson.id
            ? "bg-blue-50 border-l-4 border-blue-500"
            : "hover:bg-gray-50"
        } ${!lesson.canAccess ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
        onClick={() => handleLessonSelect(lesson)}
      >
        {getStatusIcon(lesson)}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
          <p className="text-sm text-gray-500">{lesson.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {lesson.duration && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lesson.duration}
            </span>
          )}
          <Badge
            variant={lesson.isCompleted ? "default" : "secondary"}
            className="text-xs"
          >
            {lesson.isCompleted ? "Concluído" : "Pendente"}
          </Badge>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!courseContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Curso não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header do Curso */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    {courseContent.title}
                  </CardTitle>
                  <p className="text-gray-600 mb-4">
                    {courseContent.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {courseContent.instructor}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {courseContent.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {courseContent.level}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Progresso do Curso
                      </span>
                      <span className="text-sm text-gray-600">
                        {courseContent.progress.completedLessons.length} de{" "}
                        {courseContent.progress.totalLessons} aulas
                      </span>
                    </div>
                    <Progress
                      value={courseContent.progress.progressPercentage}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar com Lista de Aulas */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conteúdo do Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {courseContent.lessons.map((lesson) => renderLesson(lesson))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Área de Conteúdo Principal */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <LessonContent
                lesson={selectedLesson}
                onMarkCompleted={markLessonAsCompleted}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Selecione uma aula para começar
                    </h3>
                    <p className="text-gray-500">
                      Escolha uma aula na lista ao lado para visualizar o
                      conteúdo
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
