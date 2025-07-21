"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, CheckCircle, BookOpen } from "lucide-react";
import { IncommingCourses } from "@/shared/course";

interface CourseProgressProps {
  courses: IncommingCourses[];
}

export default function CourseProgress({ courses }: CourseProgressProps) {
  if (!courses || courses.length === 0) {
    return null;
  }

  // Simular progresso dos cursos (em uma implementação real, isso viria da API)
  const coursesWithProgress = courses.map((course) => ({
    ...course,
    progress: Math.floor(Math.random() * 100), // Progresso simulado
    lastAccessed: new Date(
      Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
    ),
    totalLessons: Math.floor(Math.random() * 20) + 5,
    completedLessons: Math.floor(Math.random() * 15) + 1,
  }));

  // Curso mais recente
  const recentCourse = coursesWithProgress.sort(
    (a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime()
  )[0];

  return (
    <div className="space-y-6">
      {/* Continue Estudando - Curso Mais Recente */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-900">
              Continue seus estudos
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {recentCourse.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Última vez:{" "}
                {recentCourse.lastAccessed.toLocaleDateString("pt-BR")}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {recentCourse.completedLessons}/{recentCourse.totalLessons}{" "}
                  lições
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {recentCourse.progress}% completo
                </span>
              </div>
            </div>
            <Button className="ml-4">
              <PlayCircle className="h-4 w-4 mr-2" />
              Continuar
            </Button>
          </div>
          <Progress value={recentCourse.progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Lista de Progresso dos Cursos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Progresso dos Cursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursesWithProgress.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{course.title}</h4>
                    <span className="text-sm text-gray-500">
                      {course.progress}%
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-2 mb-2" />
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {course.completedLessons}/{course.totalLessons} lições
                    </span>
                    <span>
                      Último acesso:{" "}
                      {course.lastAccessed.toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {course.progress === 100 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Concluído
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Continuar
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
