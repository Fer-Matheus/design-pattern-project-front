"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCallback, useMemo } from "react";
import SidebarCollapsibleMenuItem from "./collapsible";
import SidebarDropdownMenuItem from "./dropdown";
import SidebarMenuItemLink from "./menu-item-link";
import ClientNavigation from "@/hooks/client-navigation";
import { IMenu, menusList } from "../navigation/list-menus";
import ImageLogo from "@/components/base/imageLogo";

export default function AppSidebar() {
  const clientNavigation = ClientNavigation();
  const pathname = clientNavigation.pathname;
  const { state, isMobile } = useSidebar();

  const isActivePath = useCallback(
    (menuPath: string | undefined) => {
      if (!menuPath) return false;
      if (menuPath === "/") {
        return pathname === menuPath;
      }
      return pathname.startsWith(menuPath);
    },
    [pathname],
  );

  const { activeSubmenuParent, activeSubmenu } = useMemo(() => {
    const parent = menusList.find((item) =>
      item.submenus?.some((submenu) => isActivePath(submenu.path)),
    );
    if (!parent) return {};

    const submenu = parent.submenus?.find((submenu) =>
      isActivePath(submenu.path),
    );
    return { activeSubmenuParent: parent.label, activeSubmenu: submenu?.label };
  }, [isActivePath]);

  const renderSubmenus = useCallback(
    (item: IMenu) => {
      const isActive =
        isActivePath(item.path) || activeSubmenuParent === item.label;
      const key = `${item.label}-${state}-${isActive}`;
      const SideBarMenuItemComponent =
        state === "collapsed"
          ? SidebarDropdownMenuItem
          : SidebarCollapsibleMenuItem;
      return (
        <SideBarMenuItemComponent
          key={key}
          item={item}
          pathname={pathname}
          isActive={isActive}
          activeSubmenu={activeSubmenu}
        />
      );
    },
    [activeSubmenu, activeSubmenuParent, pathname, state, isActivePath],
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={`flex flex-row items-center gap-2 ${!isMobile ? "pt-5" : ""}`}
      >
        <SidebarTrigger />
        {isMobile && <ImageLogo width={200}/>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menusList.map((item) =>
                item.submenus ? (
                  renderSubmenus(item)
                ) : (
                  <SidebarMenuItemLink
                    key={item.label}
                    item={item}
                    isActive={isActivePath(item.path)}
                  />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
