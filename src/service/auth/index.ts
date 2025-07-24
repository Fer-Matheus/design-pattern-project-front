"use server";
import { ProviderRequest } from "@/providers/axios-requests";
import AxiosInstance from "@/providers/axios-instance";
import { MyData, User, UserLogin, UserLoginResponse } from "@/shared/user";
import { CourseServer, FullCourse, IncommingCourses } from "@/shared/course";
import { CreateCourseSchema } from "@/components/base/createCourse";
import { CreateLessonRequest } from "@/shared/lesson-api";
import { getTokenFromCookies } from "@/lib/getToken";
import { CourseContent } from "@/shared/lesson";

interface Paginate<T> {
  page: number;
  per_page: number;
  total: number;
  items: T[];
}

const authProvider = ProviderRequest(
  AxiosInstance({ getToken: getTokenFromCookies }).provider
);

const login = async (username: string, password: string) => {
  try {
    const response = await authProvider.post<UserLogin, UserLoginResponse>(
      "/auth/jwt/login",
      {
        username: username,
        password: password,
        client_secret: "password",
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

const register = async (user: User) => {
  try {
    const response = await authProvider.post("/auth/register", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};

const getUserData = async () => {
  try {
    const response = await authProvider.get<MyData>("/my-data/me", {});
    return response;
  } catch (error) {
    throw error;
  }
};

const getUserCourses = async () => {
  try {
    const response =
      await authProvider.get<Paginate<IncommingCourses>>("/users/my-courses");

    return response;
  } catch (error) {
    console.error("Erro ao buscar cursos do usuário:", error);
    throw error;
  }
};

const createCourse = async (data: CreateCourseSchema) => {
  try {
    const response = await authProvider.post("/courses/", {
      title: data.title,
      description: data.description,
      price: data.price,
      is_active: true,
    });
  } catch (error) {
    throw error;
  }
};

const createLesson = async (courseId: string, data: CreateLessonRequest) => {
  console.log("Data", data);

  try {
    const response = await authProvider.post(`/courses/${courseId}/lessons`, {
      title: data.title,
      description: data.description,
      lesson_type: data.lesson_type,
      order: data.order,
    });
  } catch (error) {
    throw error;
  }
};

const getAllCourses = async () => {
  try {
    const response =
      await authProvider.get<Paginate<IncommingCourses>>("/courses/");
    return response.items;
  } catch (error) {
    throw error;
  }
};

const getCourseContentById = async (courseId: string) => {
  try {
    const response = await authProvider.get<CourseContent>(
      `/courses/${courseId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
const getCourseById = async (courseId: string) => {
  try {
    const response = await authProvider.get<FullCourse>(`/courses/${courseId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const buyCourse = async (
  jwt: string,
  courseId: string,
  payment_type: string,
  amount: number
) => {
  try {
    const response = await authProvider.post(
      `/payments/course/${courseId}`,
      { payment_type, amount },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Erro na API de pagamento:", error);
    throw error;
  }
};

const getLessons = async (courseId: string) => {
  try {
    const response = await authProvider.get<FullCourse>(`/courses/${courseId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const sendMessage = async (content: string, courseId: number) => {
  try {
    const response = await authProvider.post("/messages/", {
      content,
      course_id: courseId,
    });
    return response;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw error;
  }
};

const getMessages = async (courseId: string) => {
  try {
    const response = await authProvider.get(`/messages/course/${courseId}`, {});
    return response;
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    throw error;
  }
};

export {
  login,
  register,
  getUserData,
  getUserCourses,
  createCourse,
  createLesson,
  getLessons,
  getAllCourses,
  getCourseById,
  buyCourse,
  sendMessage,
  getMessages,
  getCourseContentById,
};
