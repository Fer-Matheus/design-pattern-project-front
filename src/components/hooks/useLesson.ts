"use client";

import { useState, useCallback } from "react";
import { lessonService } from "@/service/lesson";
import { CreateLessonRequest, CreateLessonResponse } from "@/shared/lesson-api";

interface UseLessonReturn {
  createLesson: (
    courseId: string | number,
    lessonData: Omit<
      CreateLessonRequest,
      "parent_id" | "prerequisite_id" | "order"
    >
  ) => Promise<CreateLessonResponse>;
  createVideoLesson: (
    courseId: string | number,
    title: string,
    description: string,
    filePath: string
  ) => Promise<CreateLessonResponse>;
  createTextLesson: (
    courseId: string | number,
    title: string,
    description: string,
    filePath: string
  ) => Promise<CreateLessonResponse>;
  createQuestionLesson: (
    courseId: string | number,
    title: string,
    description: string,
    quizData: any
  ) => Promise<CreateLessonResponse>;
  createModule: (
    courseId: string | number,
    title: string,
    description: string
  ) => Promise<CreateLessonResponse>;
  setCurrentModule: (moduleId: number | null) => void;
  getCurrentModule: () => number | null;
  getLessons: (courseId: string | number) => Promise<CreateLessonResponse[]>;
  updateLesson: (
    courseId: string | number,
    lessonId: string | number,
    lessonData: Partial<CreateLessonRequest>
  ) => Promise<CreateLessonResponse>;
  deleteLesson: (
    courseId: string | number,
    lessonId: string | number
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useLesson = (): UseLessonReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = useCallback(
    async <T>(request: () => Promise<T>): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const result = await request();
        return result;
      } catch (err: any) {
        const errorMessage = err.message || "Erro desconhecido";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createLesson = useCallback(
    (
      courseId: string | number,
      lessonData: Omit<
        CreateLessonRequest,
        "parent_id" | "prerequisite_id" | "order"
      >
    ) => handleRequest(() => lessonService.createLesson(courseId, lessonData)),
    [handleRequest]
  );

  const createVideoLesson = useCallback(
    (
      courseId: string | number,
      title: string,
      description: string,
      filePath: string
    ) =>
      handleRequest(() =>
        lessonService.createVideoLesson(courseId, title, description, filePath)
      ),
    [handleRequest]
  );

  const createTextLesson = useCallback(
    (
      courseId: string | number,
      title: string,
      description: string,
      filePath: string
    ) =>
      handleRequest(() =>
        lessonService.createTextLesson(courseId, title, description, filePath)
      ),
    [handleRequest]
  );

  const createQuestionLesson = useCallback(
    (
      courseId: string | number,
      title: string,
      description: string,
      quizData: any
    ) =>
      handleRequest(() =>
        lessonService.createQuestionLesson(
          courseId,
          title,
          description,
          quizData
        )
      ),
    [handleRequest]
  );

  const createModule = useCallback(
    (courseId: string | number, title: string, description: string) =>
      handleRequest(() =>
        lessonService.createModule(courseId, title, description)
      ),
    [handleRequest]
  );

  const setCurrentModule = useCallback((moduleId: number | null) => {
    lessonService.setCurrentModule(moduleId);
  }, []);

  const getCurrentModule = useCallback(
    () => lessonService.getCurrentModule(),
    []
  );

  const getLessons = useCallback(
    (courseId: string | number) =>
      handleRequest(() => lessonService.getLessons(courseId)),
    [handleRequest]
  );

  const updateLesson = useCallback(
    (
      courseId: string | number,
      lessonId: string | number,
      lessonData: Partial<CreateLessonRequest>
    ) =>
      handleRequest(() =>
        lessonService.updateLesson(courseId, lessonId, lessonData)
      ),
    [handleRequest]
  );

  const deleteLesson = useCallback(
    (courseId: string | number, lessonId: string | number) =>
      handleRequest(() => lessonService.deleteLesson(courseId, lessonId)),
    [handleRequest]
  );

  return {
    createLesson,
    createVideoLesson,
    createTextLesson,
    createQuestionLesson,
    createModule,
    setCurrentModule,
    getCurrentModule,
    getLessons,
    updateLesson,
    deleteLesson,
    loading,
    error,
  };
};
