"use client";

import { Session } from "next-auth";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import ImageLogo from "@/components/base/imageLogo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { clearUserDataCache } from "@/hooks/use-cached-user-data";

interface NavbarComponentProps {
  session?: Session | null;
}

const NavbarComponent = ({ session }: NavbarComponentProps) => {
  const router = useRouter();

  const userLogout = async () => {
    try {
      setCookie("access-token", "");
      clearUserDataCache(); // Limpar cache ao fazer logout
      router.push("/login");
    } catch (error) {}
  };

  const { isMobile } = useSidebar();
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center gap-4 border-b border-gray-200 bg-sidebar p-2 sm:static">
      {isMobile && (
        <div>
          <SidebarTrigger />
        </div>
      )}

      <div className="max-sm:hidden sm:ml-4">
        <ImageLogo width={40} />
      </div>
      <Button
        className="bg-black ml-auto flex h-auto items-center justify-center mr-10 text-md hover:scale-110 active:scale-95"
        onClick={userLogout}
      >
        Logout
      </Button>
    </header>
  );
};

export default NavbarComponent;
