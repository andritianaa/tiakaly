import { Metadata } from "next";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/current-user";

export const metadata: Metadata = {
  title: "Mot de passe oublié | Tiakaly - Une histoire sans faim",
  description:
    "Réinitialisez votre mot de passe pour accéder à votre compte Tiakaly.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://www.tiakaly.com/auth/forgot-password",
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
