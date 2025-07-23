"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Play,
  Clock,
  User,
  Users,
  DollarSign,
  FileText,
  CheckCircle,
} from "lucide-react";
import { CourseContent, Lesson } from "@/shared/lesson";
import { mockCourseContent } from "@/data/mock-course-content";

export default function CourseViewPage() {
  const params = useParams();
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento do curso
    const loadCourse = async () => {
      setIsLoading(true);
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCourseContent(mockCourseContent);
      
      // Selecionar a primeira lesson automaticamente
      if (mockCourseContent.lessons.length > 0) {
        setSelectedLesson(mockCourseContent.lessons[0]);
      }
      setIsLoading(false);
    };

    loadCourse();
  }, [params.id]);

  const getLessonIcon = (lessonType: string) => {
    switch (lessonType) {
      case "video":
        return <Play className="h-4 w-4" />;
      case "text":
        return <FileText className="h-4 w-4" />;
      case "exercise":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getLessonTypeColor = (lessonType: string) => {
    switch (lessonType) {
      case "video":
        return "bg-blue-100 text-blue-800";
      case "text":
        return "bg-green-100 text-green-800";
      case "exercise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Organizar lessons por hierarquia (parent_id)
  const organizedLessons = courseContent?.lessons.reduce((acc, lesson) => {
    if (lesson.parent_id === 0) {
      acc.push({
        ...lesson,
        children: courseContent.lessons.filter(l => l.parent_id === lesson.id)
      });
    }
    return acc;
  }, [] as (Lesson & { children: Lesson[] })[]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!courseContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Curso não encontrado</h1>
          <p className="text-gray-600">O curso solicitado não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header do Curso */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {courseContent.is_active ? "Ativo" : "Inativo"}
                </Badge>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  R$ {courseContent.price.toFixed(2)}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {courseContent.title}
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {courseContent.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{courseContent.instructor_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{courseContent.students_enrolled} alunos</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{courseContent.lessons.length} aulas</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Button size="lg" className="w-full lg:w-auto">
                Começar Curso
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lista de Aulas */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Conteúdo do Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {organizedLessons?.map((lesson, index) => (
                    <div key={lesson.id}>
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full p-4 text-left hover:bg-gray-50 border-b transition-colors ${
                          selectedLesson?.id === lesson.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getLessonTypeColor(lesson.lesson_type)}`}>
                            {getLessonIcon(lesson.lesson_type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {lesson.title}
                            </h4>
                            <p className="text-xs text-gray-500 capitalize">
                              {lesson.lesson_type}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {index + 1}
                          </span>
                        </div>
                      </button>

                      {/* Sub-lessons */}
                      {lesson.children.length > 0 && (
                        <div className="bg-gray-50">
                          {lesson.children.map((subLesson, subIndex) => (
                            <button
                              key={subLesson.id}
                              onClick={() => setSelectedLesson(subLesson)}
                              className={`w-full p-3 pl-12 text-left hover:bg-gray-100 border-b transition-colors ${
                                selectedLesson?.id === subLesson.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded ${getLessonTypeColor(subLesson.lesson_type)}`}>
                                  {getLessonIcon(subLesson.lesson_type)}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-800 text-sm">
                                    {subLesson.title}
                                  </h5>
                                  <p className="text-xs text-gray-500 capitalize">
                                    {subLesson.lesson_type}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {index + 1}.{subIndex + 1}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo da Aula Selecionada */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getLessonIcon(selectedLesson.lesson_type)}
                        {selectedLesson.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={getLessonTypeColor(selectedLesson.lesson_type)}>
                          {selectedLesson.lesson_type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Aula {selectedLesson.order}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Área de conteúdo da aula */}
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <div className="mb-4">
                        {getLessonIcon(selectedLesson.lesson_type)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {selectedLesson.title}
                      </h3>
                      <p className="text-gray-600">
                        Conteúdo da aula tipo: <span className="font-medium capitalize">{selectedLesson.lesson_type}</span>
                      </p>
                      
                      {selectedLesson.lesson_type === "video" && (
                        <div className="mt-6">
                          <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                          <p className="text-sm text-gray-500 mt-2">Player de vídeo seria carregado aqui</p>
                        </div>
                      )}

                      {selectedLesson.lesson_type === "text" && (
                        <div className="mt-6 p-6 bg-white rounded-lg border text-left">
                          <h4 className="font-semibold mb-3">Conteúdo de Texto</h4>
                          <p className="text-gray-600 leading-relaxed">
                            Este seria o conteúdo textual da aula. Aqui você poderia ter artigos, 
                            explicações detalhadas, códigos de exemplo e muito mais.
                          </p>
                        </div>
                      )}

                      {selectedLesson.lesson_type === "exercise" && (
                        <div className="mt-6 p-6 bg-white rounded-lg border text-left">
                          <h4 className="font-semibold mb-3">Exercício Prático</h4>
                          <p className="text-gray-600 mb-4">
                            Complete o exercício a seguir para consolidar seu aprendizado.
                          </p>
                          <Button variant="outline" className="w-full">
                            Iniciar Exercício
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Navegação entre aulas */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button variant="outline" size="sm">
                        ← Aula Anterior
                      </Button>
                      <span className="text-sm text-gray-500">
                        Aula {selectedLesson.order} de {courseContent.lessons.length}
                      </span>
                      <Button variant="outline" size="sm">
                        Próxima Aula →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Selecione uma aula
                  </h3>
                  <p className="text-gray-500">
                    Escolha uma aula no menu lateral para começar seus estudos.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
