import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuLinkItemProps } from "./types";

const SidebarMenuItemLink = ({ item, isActive }: SidebarMenuLinkItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton isActive={isActive} asChild tooltip={item.label}>
      <Link href={item.path ?? "#"} prefetch={false}>
        {item.icon}
        <span>{item.label}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);
export default SidebarMenuItemLink;
