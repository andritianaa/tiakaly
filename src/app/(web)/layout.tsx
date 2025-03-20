import { Navbar } from "@/app/(web)/components/navbar";

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}
