"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Session } from "next-auth";
import { PropsWithChildren } from "react";
import AppSidebar from "../sidebar";
import NavbarComponent from "./navbar";

type Props = {
  session: Session | null;
};

export default function NavigationLayoutView({
  children,
  session,
}: PropsWithChildren<Props>) {
  return (
    <SidebarProvider className="flex flex-col bg-muted/40">
      <div className="h-full min-h-screen w-full flex-col">
        <div className="flex-grow sm:flex sm:flex-row">
          <AppSidebar />

          <div className="w-full">
            <NavbarComponent session={session} />
            <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
