// Interfaces para a API de lessons
export interface CreateLessonRequest {
  title: string;
  description: string;
  lesson_type: string; // Video, Text, Question, Module
  order: number;
}

export interface CreateLessonResponse {
  id: number;
  title: string;
  description: string;
  lesson_type: string;
  order: number;
  file_path?: string;
  quiz_data?: any;
  parent_id?: number;
  prerequisite_id?: number;
  course_id: number;
  created_at: string;
  updated_at: string;
}

export interface LessonApiError {
  message: string;
  details?: any;
}

// Mapeamento entre tipos da API e tipos do frontend
export const mapLessonTypeToApi = (
  type: string
): "video" | "text" | "question" | "module" => {
  switch (type) {
    case "video":
      return "video";
    case "text":
      return "text";
    case "question":
      return "question";
    case "module":
      return "module";
    default:
      return "text";
  }
};

export const mapLessonTypeFromApi = (
  type: "video" | "text" | "question" | "module"
): string => {
  switch (type) {
    case "video":
      return "video";
    case "text":
      return "text";
    case "question":
      return "question";
    case "module":
      return "module";
    default:
      return "text";
  }
};
