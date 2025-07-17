"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, User, Play, CheckCircle, Star } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  image: string;
  rating: number;
  studentsCount: number;
  category: string;
  isEnrolled?: boolean;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
}

export default function CourseCard({
  id,
  title,
  description,
  instructor,
  duration,
  level,
  image,
  rating,
  studentsCount,
  category,
  isEnrolled = false,
  progress = 0,
  completedLessons = 0,
  totalLessons = 0,
}: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary">{category}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white">
            {level}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <span className="text-sm text-gray-600">
            ({studentsCount} alunos)
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {isEnrolled && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progresso</span>
              <span className="text-gray-600">
                {completedLessons} de {totalLessons} aulas
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="space-y-2">
          {isEnrolled ? (
            <>
              <Link href={`/course/${id}`}>
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Continuar Curso
                </Button>
              </Link>
              {progress === 100 && (
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Curso Concluído
                </div>
              )}
            </>
          ) : (
            <Link href={`/course/${id}`}>
              <Button className="w-full" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Ver Curso
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
