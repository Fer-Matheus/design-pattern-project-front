"use server";
import { ProviderRequest } from "@/providers/axios-requests";
import AxiosInstance from "@/providers/axios-instance";
import { MyData, User, UserLogin, UserLoginResponse } from "@/shared/user";
import { setCookie } from "cookies-next";

const authProvider = ProviderRequest(AxiosInstance({}).provider);

const login = async (username: string, password: string) => {
  try {
    const response = await authProvider.post<UserLogin, UserLoginResponse>(
      "/auth/jwt/login",
      {
        username: username,
        password: password
      },
      {
        headers: {
        'Content-Type': 'multipart/form-data',
        }
      }
    );

    setCookie("access-token", response.access_token)
    setCookie("token-type", response.token_type)

    return response;
  }
  catch (error){
  }
};

const register = async (user: User) => {
  try {
    const response = await authProvider.post("/auth/register", user, {
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    throw error;
  }
};

const getUserData = async (jwt: string) => {
  try {
    const response = await authProvider.get<MyData>("/my-data/me", {
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      withCredentials: true
    })
    return response
  } catch (error) {
    throw error
  }
}

export { login, register, getUserData };
