import { MouseAnimation } from "@/components/mouse-animation";

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MouseAnimation />
      {children}
    </>
  );
}
