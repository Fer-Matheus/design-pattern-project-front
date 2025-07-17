import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { SideBarMenuItemComponentProps } from "./types";
import { useLocalStorage } from "@/hooks/use-storage";

const SidebarCollapsibleMenuItem = ({
  item,
  pathname,
  isActive,
  activeSubmenu,
}: SideBarMenuItemComponentProps) => {
  const [open, setOpen] = useLocalStorage(`sidebar-menu-${item.label}`, true);

  const handleChangeOpen = useCallback(
    (value: boolean) => {
      setOpen(value);
    },
    [setOpen],
  );

  const isActiveCollapsibleSidebarMenu = !open && isActive;

  const parentText =
    isActiveCollapsibleSidebarMenu && activeSubmenu
      ? `${item.label} / ${activeSubmenu}`
      : item.label;

  return (
    <Collapsible
      open={open}
      onOpenChange={handleChangeOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger className="w-full">
          <SidebarMenuButton
            tooltip={parentText}
            asChild
            isActive={isActiveCollapsibleSidebarMenu}
          >
            <div>
              {item.icon}
              <span className="min-w-max">{parentText}</span>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </div>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item?.submenus?.map((submenu) => (
              <SidebarMenuSubItem key={submenu.label}>
                <SidebarMenuButton
                  isActive={!!submenu.path && pathname.startsWith(submenu.path)}
                  asChild
                >
                  <Link href={submenu.path ?? "#"} prefetch={false}>
                    {submenu.icon}
                    <span>{submenu.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
export default SidebarCollapsibleMenuItem;
