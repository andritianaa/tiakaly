import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/navigation/main-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { currentUser } from "@/lib/current-user";

export default async function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    return redirect("/auth/login");
  } else if (user.permissions.includes("ADMIN")) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    );
  } else {
    return redirect("/");
  }
}
