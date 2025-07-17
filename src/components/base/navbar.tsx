"use client";

import { Button } from "../ui/button";
import ImageLogo from "./imageLogo";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

const NavbarComponent = () => {
  const router = useRouter();

  const userLogout = async () => {
    try {

      setCookie("access-token", "");

      router.push("/login");
    } catch (error) {}
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center gap-4 border-b border-gray-200 bg-sidebar p-2 sm:static">
      <div className="max-sm:hidden sm:ml-4">
        <ImageLogo width={40} />
      </div>

      <Button
        className="ml-auto flex h-auto items-center justify-center mr-10 hover:scale-110 active:scale-95"
        onClick={userLogout}
      >
        Logout
      </Button>
    </header>
  );
};

export default NavbarComponent;
