export interface CourseContent {
  id: number;
  title: string;
  description: string;
  price: number;
  is_active: boolean;
  instructor_id: number;
  instructor_name: string;
  students_enrolled: number;
  lessons: Array<Lesson>;
}

export interface Lesson {
  id: number;
  title: string;
  lesson_type: string;
  order: number;
  course_id: number;
  parent_id: number;
}
