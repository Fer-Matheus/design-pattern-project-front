"use server";

import { cookies } from "next/headers";

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token"); // Substitua "token" pelo nome do cookie que contém o token
  return token!.value;
}
