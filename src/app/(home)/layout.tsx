import NavigationLayout from "@/components/layout/navigation";
import { PropsWithChildren } from "react";

export default function HomeLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <NavigationLayout>
      <div className="p-8">{children}</div>
    </NavigationLayout>
  );
}