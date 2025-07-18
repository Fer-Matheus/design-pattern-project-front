"use server";
import { ProviderRequest } from "@/providers/axios-requests";
import AxiosInstance from "@/providers/axios-instance";
import { MyData, User, UserLogin, UserLoginResponse } from "@/shared/user";
import { CourseServer, FullCourse, IncommingCourses } from "@/shared/course";
import { CreateCourseSchema } from "@/components/base/createCourse";
import { CreateLessonRequest } from "@/shared/lesson-api";

const authProvider = ProviderRequest(AxiosInstance({}).provider);

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

const getUserData = async (jwt: string) => {
  try {
    const response = await authProvider.get<MyData>("/my-data/me", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const getUserCourses = async (jwt: string) => {
  try {
    const response = await authProvider.get<Paginate<IncommingCourses>>(
      "/users/my-courses",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return response;
  } catch (error) {}
};

const createCourse = async (jwt: string, data: CreateCourseSchema) => {
  try {
    const response = await authProvider.post(
      "/courses/",
      {
        title: data.title,
        description: data.description,
        price: data.price,
        is_active: true,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

const createLesson = async (
  jwt: string,
  courseId: string,
  data: CreateLessonRequest
) => {
  console.log("Data", data);

  try {
    const response = await authProvider.post(
      `/courses/${courseId}/lessons`,
      {
        title: data.title,
        description: data.description,
        lesson_type: data.lesson_type,
        order: data.order,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

const getAllCourses = async (jwt: string) => {
  try {
    const response = await authProvider.get<Paginate<CourseServer>>(
      "/courses/",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.items;
  } catch (error) {
    throw error;
  }
};

const getCourseById = async (jwt: string, courseId: string) => {
  try {
    const response = await authProvider.get<FullCourse>(
      `/courses/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
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
  console.log("Payment_type: ", payment_type);
  console.log("Amount: ", amount);

  try {
    const response = await authProvider.post(
      `/payments/course/${courseId}`,
      { payment_type, amount, },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
  } catch (error) {
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
  getAllCourses,
  getCourseById,
  buyCourse,
};
