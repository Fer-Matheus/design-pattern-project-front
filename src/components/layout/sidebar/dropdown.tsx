"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SideBarMenuItemComponentProps } from "./types";

const SidebarDropdownMenuItem = ({
  item,
  pathname,
  isActive,
  activeSubmenu,
}: SideBarMenuItemComponentProps) => {
  const tooltip =
    isActive && activeSubmenu ? `${item.label} / ${activeSubmenu}` : item.label;
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={tooltip}
            isActive={isActive}
            className="relative"
          >
            {item.icon}
            <span className="sr-only">{item.label}</span>
            <ChevronRight className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 transform pl-[3px]" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-48">
          {item?.submenus?.map((submenu) => (
            <DropdownMenuItem
              key={`${item.label}/${submenu.label}`}
              className={
                !!submenu.path && pathname?.includes(submenu.path)
                  ? "focus:text-sidebar-active-foreground"
                  : ""
              }
              asChild
            >
              <Link
                href={submenu.path ?? "#"}
                className={
                  !!submenu.path && pathname?.includes(submenu.path)
                    ? "text-sidebar-active-foreground"
                    : ""
                }
                prefetch={false}
              >
                {submenu.icon}
                <span className="ml-2">{submenu.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
export default SidebarDropdownMenuItem;
