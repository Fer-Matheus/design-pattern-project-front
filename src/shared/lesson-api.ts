// Interfaces para a API de lessons
export interface CreateLessonRequest {
  title: string;
  description: string;
  lesson_type: "V" | "T" | "Q" | "M"; // Video, Text, Question, Module
  order: number;
  file_path?: string;
  quiz_data?: {
    additionalProp1?: any;
    additionalProp2?: any;
    additionalProp3?: any;
  };
  parent_id?: number; // ID do módulo pai (se for uma lesson dentro de um módulo)
  prerequisite_id?: number; // ID da lesson/módulo que precisa ser completado antes
}

export interface CreateLessonResponse {
  id: number;
  title: string;
  description: string;
  lesson_type: "V" | "T" | "Q" | "M";
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
export const mapLessonTypeToApi = (type: string): "V" | "T" | "Q" | "M" => {
  switch (type) {
    case "video":
      return "V";
    case "text":
      return "T";
    case "question":
      return "Q";
    case "module":
      return "M";
    default:
      return "T";
  }
};

export const mapLessonTypeFromApi = (type: "V" | "T" | "Q" | "M"): string => {
  switch (type) {
    case "V":
      return "video";
    case "T":
      return "text";
    case "Q":
      return "question";
    case "M":
      return "module";
    default:
      return "text";
  }
};
