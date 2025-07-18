"use server";

import { cookies } from "next/headers";

export async function getTokenFromCookies() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access-token"); // Substitua "token" pelo nome do cookie que contém o token
  return token?.value || null;
}
