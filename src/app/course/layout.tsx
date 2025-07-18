import NavigationLayout from "@/components/layout/navigation";
import { PropsWithChildren } from "react";

export default function CourseLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <NavigationLayout>
      <div className="p-8">{children}</div>
    </NavigationLayout>
  );
}
