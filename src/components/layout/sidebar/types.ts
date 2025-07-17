import { IMenu } from "../navigation-layout/list-menus";

export type SidebarMenuLinkItemProps = {
  item: IMenu;
  isActive: boolean;
};

export type SideBarMenuItemComponentProps = {
  pathname: string;
  activeSubmenu: string | undefined;
} & SidebarMenuLinkItemProps;
