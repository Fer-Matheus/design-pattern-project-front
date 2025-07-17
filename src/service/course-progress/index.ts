import { CourseContent, CourseProgress, Lesson } from "@/shared/lesson";

export interface CourseProgressService {
  getCourseContent: (courseId: string) => Promise<CourseContent>;
  updateLessonProgress: (
    courseId: string,
    lessonId: string,
    isCompleted: boolean
  ) => Promise<void>;
  getCurrentLesson: (courseId: string) => Promise<string | null>;
  getOverallProgress: (courseId: string) => Promise<CourseProgress>;
}

// Implementação mockada do serviço
export const courseProgressService: CourseProgressService = {
  getCourseContent: async (courseId: string): Promise<CourseContent> => {
    // Simular delay da API
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Importar dados mockados
    const { mockCourseContent } = await import("@/data/mock-course-content");
    return mockCourseContent;
  },

  updateLessonProgress: async (
    courseId: string,
    lessonId: string,
    isCompleted: boolean
  ): Promise<void> => {
    // Simular atualização no backend
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Aqui você implementaria a lógica para atualizar o progresso no backend
    console.log(
      `Updating lesson ${lessonId} in course ${courseId}: completed = ${isCompleted}`
    );

    // Simular atualização local
    const progress = JSON.parse(
      localStorage.getItem(`course-progress-${courseId}`) || "{}"
    );

    if (isCompleted) {
      progress.completedLessons = [
        ...(progress.completedLessons || []),
        lessonId,
      ];
      progress.completedLessons = [...new Set(progress.completedLessons)]; // Remove duplicatas
    } else {
      progress.completedLessons = (progress.completedLessons || []).filter(
        (id: string) => id !== lessonId
      );
    }

    localStorage.setItem(
      `course-progress-${courseId}`,
      JSON.stringify(progress)
    );
  },

  getCurrentLesson: async (courseId: string): Promise<string | null> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const progress = JSON.parse(
      localStorage.getItem(`course-progress-${courseId}`) || "{}"
    );
    return progress.currentLessonId || null;
  },

  getOverallProgress: async (courseId: string): Promise<CourseProgress> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const progress = JSON.parse(
      localStorage.getItem(`course-progress-${courseId}`) || "{}"
    );
    const defaultProgress: CourseProgress = {
      courseId,
      currentLessonId: "lesson-1",
      completedLessons: [],
      totalLessons: 6,
      progressPercentage: 0,
      lastAccessedAt: new Date().toISOString(),
    };

    return { ...defaultProgress, ...progress };
  },
};

// Função helper para contar lessons recursivamente
export const countLessons = (lessons: Lesson[]): number => {
  let count = 0;

  for (const lesson of lessons) {
    if (lesson.type === "module") {
      count += countLessons(lesson.lessons);
    } else {
      count += 1;
    }
  }

  return count;
};

// Função helper para atualizar status das lessons baseado no progresso
export const updateLessonStatuses = (
  lessons: Lesson[],
  completedLessons: string[],
  currentLessonId: string
): Lesson[] => {
  const updatedLessons: Lesson[] = [];

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];

    if (lesson.type === "module") {
      const updatedSubLessons = updateLessonStatuses(
        lesson.lessons,
        completedLessons,
        currentLessonId
      );
      const allSubLessonsCompleted = updatedSubLessons.every(
        (sub) => sub.type === "module" || sub.isCompleted
      );

      updatedLessons.push({
        ...lesson,
        lessons: updatedSubLessons,
        isCompleted: allSubLessonsCompleted,
        status: allSubLessonsCompleted ? "completed" : "available",
      });
    } else {
      const isCompleted = completedLessons.includes(lesson.id);
      const isCurrent = lesson.id === currentLessonId;

      // Determinar se a lesson pode ser acessada
      const canAccess =
        i === 0 ||
        isCompleted ||
        isCurrent ||
        (i > 0 && updatedLessons[i - 1].isCompleted);

      let status: "locked" | "available" | "current" | "completed" = "locked";

      if (isCompleted) {
        status = "completed";
      } else if (isCurrent) {
        status = "current";
      } else if (canAccess) {
        status = "available";
      }

      updatedLessons.push({
        ...lesson,
        isCompleted,
        canAccess,
        status,
      });
    }
  }

  return updatedLessons;
};
