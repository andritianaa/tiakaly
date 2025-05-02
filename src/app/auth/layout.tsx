import { Metadata } from "next";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/current-user";

export const metadata: Metadata = {
  title: "Authentification | Tiakaly - Une histoire sans faim",
  description:
    "Connectez-vous ou créez un compte pour accéder à toutes les fonctionnalités de Tiakaly.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://www.tiakaly.com/auth/login",
  },
};

export default async function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (user) {
    return redirect("/");
  }
  return <>{children}</>;
}
