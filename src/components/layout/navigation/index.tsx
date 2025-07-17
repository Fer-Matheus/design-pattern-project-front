import NavigationLayoutView from "./view";

export default async function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <NavigationLayoutView session={null}>{children}</NavigationLayoutView>
  );
}
