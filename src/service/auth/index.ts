"use server";
import { auth, signIn, signOut } from "@/auth";
import { ProviderRequest } from "@/providers/axios-requests";
import { redirect } from "next/navigation";

import { LOGIN_ROUTE } from "./api.routes";
import AxiosInstance from "@/providers/axios-instance";
import { User } from "@/shared/user";

const authProvider = ProviderRequest(AxiosInstance({}).provider);

const login = async (document: string, password: string) => {
  await signIn("credentials", {
    username: document,
    password: password,
    redirect: false,
  });
};

const register = async ( user: User) => {
  try { 
    await authProvider.post("/auth/register", user);
  } catch (error) {
    return error
  }
}

const authUser = async (document: string, password: string) => {
  try {
    await authProvider.post("/login", {
      document,
      password,
    });
  } catch (e) {}

  return {
    id: 1,
    name: "test user",
    email: document,
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
