export type LessonType = "video" | "text" | "question" | "module";

export type LessonStatus = "locked" | "available" | "current" | "completed";

export interface BaseLesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  order: number;
  status: LessonStatus;
  duration?: string;
  isCompleted: boolean;
  canAccess: boolean;
}

export interface VideoLesson extends BaseLesson {
  type: "video";
  videoUrl: string;
  thumbnail?: string;
  transcript?: string;
}

export interface TextLesson extends BaseLesson {
  type: "text";
  content: string;
  readingTime: string;
}

export interface QuestionLesson extends BaseLesson {
  type: "question";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface ModuleLesson extends BaseLesson {
  type: "module";
  lessons: Lesson[];
  isExpanded: boolean;
}

export type Lesson = VideoLesson | TextLesson | QuestionLesson | ModuleLesson;

export interface CourseProgress {
  courseId: string;
  currentLessonId: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercentage: number;
  lastAccessedAt: string;
}

export interface CourseContent {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  image: string;
  lessons: Lesson[];
  progress: CourseProgress;
}
