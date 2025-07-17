import { CourseServer } from "./course";

export type User = {
  email: string;
  password: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  first_name: string;
  last_name: string;
  user_type: string;
};

export type UserLogin = {
  username: string;
  password: string;
}
export type UserLoginResponse = {
  access_token: string;
  token_type: string;
}

export type MyData = User & {
  courses: CourseServer
}
