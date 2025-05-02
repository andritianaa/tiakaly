import { Metadata } from "next";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/current-user";

export const metadata: Metadata = {
  title: "Connexion | Tiakaly - Une histoire sans faim",
  description:
    "Connectez-vous à votre compte Tiakaly pour découvrir les meilleurs plans bouffe de Madagascar.",
  robots: {
    index: true,
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
