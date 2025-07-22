export interface Message {
  id: number;
  content: string;
  course_id: number;
  sender_id: number;
  created_at: string;
}

export interface SendMessageRequest {
  content: string;
  course_id: number;
}

export interface CourseChat {
  course_id: number;
  course_title: string;
  messages: Message[];
}
