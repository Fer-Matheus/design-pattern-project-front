import { FaAtlas, FaHome, FaRegUser } from "react-icons/fa";

export interface IMenu {
  label: string;
  icon: React.ReactNode;
  path: string;
  submenus?: Omit<IMenu, "submenus">[];
}

export const menusList: Array<IMenu> = [
  {
    label: "Início",
    icon: <FaHome />,
    path: "/",
  },
  {
    label: "Cursos",
    icon: <FaAtlas />,
    path: "/courses",
  },
];
