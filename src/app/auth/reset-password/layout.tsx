import { Metadata } from "next";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/current-user";

export const metadata: Metadata = {
  title: "Réinitialisation du mot de passe | Tiakaly - Une histoire sans faim",
  description: "Définissez un nouveau mot de passe pour votre compte Tiakaly.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.tiakaly.com/auth/reset-password",
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
