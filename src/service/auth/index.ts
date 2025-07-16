"use server";
import { auth, signIn, signOut } from "@/auth";
import { ProviderRequest } from "@/providers/axios-requests";
import { redirect } from "next/navigation";

import { LOGIN_ROUTE } from "./api.routes";
import AxiosInstance from "@/providers/axios-instance";
import { User } from "@/shared/user";

const authProvider = ProviderRequest(AxiosInstance({}).provider);

const login = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
    username: email,
    password: password,
    redirect: false,
  });
  } catch (error) {
    throw error
  }
};

const register = async ( user: User) => {
  try { 
    await authProvider.post("/auth/register", user);
  } catch (error) {
    return error
  }
}

const authUser = async (username: string, password: string) => {
  try {
    await authProvider.post("/auth/jwt/login",{
      username,
      password
    });
  } catch (e) {}

  return {
    id: 1,
    name: "test user",
    email: username,
    role: 1,
    password: password,
  };
};

const getUserToken = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("User not found");
  }
  return session.user;
};

const logout = async () => {
  await signOut({ redirect: false });
  redirect(LOGIN_ROUTE);
};

export { login, logout, authUser, register };
