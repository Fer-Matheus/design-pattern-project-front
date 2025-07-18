"use server";
import { ProviderRequest } from "@/providers/axios-requests";
import AxiosInstance from "@/providers/axios-instance";
import { MyData, User, UserLogin, UserLoginResponse } from "@/shared/user";
import { IncommingCourses } from "@/shared/course";
import { CreateCourseSchema } from "@/components/base/createCourse";

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
  } catch (error) {}
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

export { login, register, getUserData, getUserCourses, createCourse };
