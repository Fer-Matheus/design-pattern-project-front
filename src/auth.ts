import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { authUser } from "./service/auth";

async function getUser(username: string, password: string): Promise<any> {
  return authUser(username, password);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await getUser(
          credentials.username as string,
          credentials.password as string,
        );

        return user ?? null;
      },
    }),
  ],
});
